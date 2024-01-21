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
exports.messagePut = exports.messageDelete = exports.messagePost = exports.messageGet = exports.chatGet = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
//IMPLEMENT THE INBOX PAGE AND MESSAGE PAGE ON FRONT END
//WILL USE USERNAME AS THE PARAMATER
//SEARCH THE USER BY USERNAME AND MAKE THE HEADER OF THE RECEPIENT
//WILL HAVE TO TRY AND SET  UP REALTIME MESSAGING WITH WEB SOCKETS
const chatGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.wreathe_user.findUnique({
            where: { user_uid: req.user.id },
        });
        const recepient = yield prisma.wreathe_user.findUnique({
            where: { username: req.params.recepientUsername },
        });
        if (!user || !recepient) {
            console.error('USERS NOT FOUND');
            return res.status(404).json({ error: 'Users not found' });
        }
        if (req.params.recepientUsername === req.user.username) {
            console.error('CAN NOT MESSAGE YOURSELF');
            return res.status(404).json({ error: 'CAN NOT CHAT WITH YOURSELF' });
        }
        const directMessages = yield prisma.message.findMany({
            where: {
                OR: [
                    { sender_ref: user.user_uid, recepient_ref: recepient.user_uid },
                    { sender_ref: recepient.user_uid, recepient_ref: user.user_uid },
                ],
            },
            orderBy: { message_timestamp: 'asc' },
            include: {
                sender: true,
                recepient: true,
            },
        });
        return res.json({
            success: true,
            message: 'SUCCESSFULLY FETCHED MESSAGES',
            directMessages,
            recepient,
            userId: req.user.id,
        });
    }
    catch (error) {
        console.error('Error fetching direct messages:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.chatGet = chatGet;
const messageGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.message.findUniqueOrThrow({
            //change the method to grab userid
            where: {
                message_uid: req.params.messageId,
            },
        });
        return res.json({
            success: true,
            message: 'SUCCESSFULLY FETCHED THE MESSAGE',
            user,
        });
    }
    catch (err) {
        console.error(err);
        return res
            .status(403)
            .json({ success: false, message: 'Internal Server Error' });
    }
});
exports.messageGet = messageGet;
exports.messagePost = [
    (0, express_validator_1.body)('content', 'Content is required')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .notEmpty()
        .withMessage('Content can not be an empty space'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            const messageData = {
                content: req.body.content,
                sender_ref: req.user.id,
                recepient_ref: req.params.recepientUsername,
            };
            if (!errors.isEmpty()) {
                console.error('VALIDATION FAILURE:', errors.array());
                return res.json({ messageData, errors: errors.array() });
            }
            // Find user IDs based on usernames
            const sender = yield prisma.wreathe_user.findUnique({
                where: { username: req.user.username },
            });
            const recepient = yield prisma.wreathe_user.findUnique({
                where: { username: req.params.recepientUsername },
            });
            if (!sender || !recepient) {
                return res.status(404).json({ error: 'Sender or recipient not found' });
            }
            messageData.recepient_ref = recepient.user_uid;
            // Create a direct message
            const directMessage = yield prisma.message.create({
                data: messageData,
            });
            return res.status(201).json({
                success: true,
                message: 'MESSAGE WAS SUCCESSFULLY SENT',
                directMessage,
            });
        }
        catch (err) {
            console.error('THERE WAS AN ISSUE CREATING/SENDING THE MESSAGE', err);
            return res
                .status(403)
                .json({ err, message: 'there was an issue creating a message' });
        }
    }),
];
const messageDelete = (req, res) => {
    console.log(req.params);
};
exports.messageDelete = messageDelete;
const messagePut = (req, res) => {
    console.log(req.params);
};
exports.messagePut = messagePut;
