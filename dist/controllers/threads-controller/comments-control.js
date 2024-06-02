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
exports.commentsDelete = exports.commentsPut = exports.commentsPost = exports.commentsGet = void 0;
const express_validator_1 = require("express-validator");
// import cloudinary from '../../utils/cloudinary'
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const commentsGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield prisma.comment.findMany({
            where: { ispublished: true },
            orderBy: { comment_timestamp: 'desc' },
        });
        return res.json({
            success: true,
            message: 'SUCCESSFULLY FETCHED COMMENTS',
            comments,
        });
    }
    catch (err) {
        res.status(403).json({
            err,
            success: false,
            message: 'there was an issue fetching comments',
        });
    }
});
exports.commentsGet = commentsGet;
exports.commentsPost = [
    (0, express_validator_1.body)('content', 'Content is required').trim().isLength({ min: 1 }),
    // body('isPublished', 'boolean value needed').isBoolean(),
    (0, express_validator_1.param)('threadid', 'missing thread id parameter').isUUID(),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        const commentData = {
            content: req.body.content,
            // ispublished: req.body.isPublished,
            ispublished: true,
            //change the method to grab useruid usually was req.user.:id
            author_ref: req.user.id,
            thread_ref: req.params.threadid,
        };
        if (!errors.isEmpty()) {
            console.error('VALIDATION FAILURE:', errors.array());
            return res.json({ commentData, errors: errors.array() });
        }
        try {
            const comment = yield prisma.comment.create({
                data: commentData,
            });
            const commentField = yield prisma.thread.update({
                where: { thread_uid: req.params.threadid },
                data: {
                    comment: {
                        connect: { comment_uid: comment.comment_uid },
                    },
                },
            });
            console.log(commentField, '\ncomment field');
            const threadURL = `users/${req.user.id}/threads/${comment.thread_ref}`;
            const commentURL = `users/${req.user.id}/threads/${comment.thread_ref}/comments/${comment.comment_uid}`;
            return res.json({
                success: true,
                message: 'SUCCESSFULLY SUBMITTED COMMENT',
                comment,
                commentURL,
                threadURL,
            });
        }
        catch (err) {
            console.error('THERE WAS AN ISSUE CREATING A NEW COMMENT', err);
            return res.status(403).json({
                err,
                success: false,
                message: 'there was an issue creating a new comment',
            });
        }
    }),
];
exports.commentsPut = [
    (0, express_validator_1.body)('content', 'Content is required').trim().isLength({ min: 1 }),
    (0, express_validator_1.body)('isPublished', 'boolean value needed').isBoolean(),
    (0, express_validator_1.param)('threadid', 'missing thread id parameter').notEmpty().isUUID(),
    (0, express_validator_1.param)('commentid', 'missing comment id parameter').notEmpty().isUUID(),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        const commentData = {
            comment_uid: req.params.commentid,
            content: req.body.content,
            ispublished: req.body.isPublished,
            thread_ref: req.params.threadid,
            //change the method to grab useruid usually was req.user.:id
            author_ref: req.body.userUid,
        };
        if (!errors.isEmpty()) {
            return res.json({ commentData, errors: errors.array() });
        }
        try {
            const comment = yield prisma.comment.update({
                where: { comment_uid: req.params.commentid },
                data: commentData,
            });
            const commentURL = `/threads/${comment.thread_ref}/comments/${comment.comment_uid}`;
            return res.json({
                success: true,
                message: 'SUCCESSFULLY UPDATED COMMENT',
                comment,
                commentURL,
            });
        }
        catch (err) {
            return res.status(403).json({
                err,
                success: false,
                message: 'there was an issue creating a new comment',
            });
        }
    }),
];
const commentsDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const comment = await prisma.comment.findUniqueOrThrow({
        //   where: { comment_uid: req.params.commentid },
        // })
        // const deletedImage = await cloudinary.uploader.destroy(
        //   comment.image.public_url,
        //   { invalidate: true },
        // )
        const deletedComment = yield prisma.comment.delete({
            where: { comment_uid: req.params.commentid },
        });
        // console.log(deletedImage, '\n cloudinary image deleted')
        console.log(deletedComment, '\n Comment has been deleted');
        return res.json({
            success: true,
            message: 'SUCCESSFULLY DELETED COMMENT',
            deletedComment,
        });
    }
    catch (err) {
        res
            .status(403)
            .json({
            err,
            success: false,
            message: 'there was an issue fetching the comment',
        });
    }
});
exports.commentsDelete = commentsDelete;
