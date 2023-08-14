"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.threadsDelete = exports.threadsPut = exports.threadsPost = exports.threadsGet = void 0;
const express_validator_1 = require("express-validator");
const client_1 = require("@prisma/client");
// import cloudinary from '../../utils/cloudinary'
const prisma = new client_1.PrismaClient();
const threadsGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const threads = yield prisma.thread.findMany({
            where: { ispublished: true },
            orderBy: { thread_timestamp: 'desc' },
        });
        return res.json({ threads });
    }
    catch (err) {
        res.status(403).json({ err, message: 'there was an issue fetching posts' });
    }
});
exports.threadsGet = threadsGet;
exports.threadsPost = [
    (0, express_validator_1.body)('content', 'Content is required').trim().isLength({ min: 1 }),
    (0, express_validator_1.body)('isPublished', 'boolean value needed').isBoolean(),
    (0, express_validator_1.body)('userUid', 'missing a user id reference').isUUID(),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        const threadData = {
            content: req.body.content,
            ispublished: req.body.isPublished,
            //change the method to grab useruid
            author_ref: req.body.userUid,
        };
        if (!errors.isEmpty()) {
            return res.json({ threadData, errors: errors.array() });
        }
        try {
            const thread = yield prisma.thread.create({
                data: threadData,
            });
            const threadURL = `/threads/${thread.thread_uid}`;
            return res.json({ thread, threadURL });
        }
        catch (err) {
            return res
                .status(403)
                .json({ err, message: 'there was an issue creating a new post' });
        }
    }),
];
exports.threadsPut = [
    (0, express_validator_1.body)('content', 'Content is required').trim().isLength({ min: 1 }),
    (0, express_validator_1.body)('isPublished', 'boolean value needed').isBoolean(),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        const threadData = {
            thread_uid: req.params.threadid,
            content: req.body.content,
            ispublished: req.body.isPublished,
            //change the method to grab useruid
            author_ref: req.body.userUid,
        };
        if (!errors.isEmpty()) {
            return res.json({ threadData, errors: errors.array() });
        }
        try {
            const thread = yield prisma.thread.update({
                where: { thread_uid: req.params.threadid },
                data: threadData,
            });
            const threadURL = `/threads/${thread.thread_uid}`;
            return res.json({ thread, threadURL });
        }
        catch (err) {
            return res
                .status(403)
                .json({ err, message: 'there was an issue creating a new post' });
        }
    }),
];
const threadsDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const thread = await prisma.thread.findUniqueOrThrow({
        //   where: { thread_uid: req.params.threadid },
        // })
        try {
            // const deletedImage = await cloudinary.uploader.destroy(
            //   thread.image.public_url,
            //   { invalidate: true },
            // )
            const deletedThread = yield prisma.thread.delete({
                where: { thread_uid: req.params.threadid },
            });
            // console.log(deletedImage, '\n cloudinary image deleted')
            console.log(deletedThread, '\n Thread has been deleted');
            return res.json({ deletedThread });
        }
        catch (err) {
            res.status(403).json({ err, message: 'there was an deleting the post.' });
        }
    }
    catch (err) {
        res.status(403).json({ err, message: 'there was an issue fetching posts' });
    }
});
exports.threadsDelete = threadsDelete;
