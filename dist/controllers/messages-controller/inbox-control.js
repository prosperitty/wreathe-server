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
exports.inboxSearch = exports.inboxGet = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const inboxGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inbox = yield prisma.message.findMany({
            where: {
                OR: [{ sender_ref: req.user.id }, { recepient_ref: req.user.id }],
            },
            orderBy: { message_timestamp: 'asc' },
            distinct: ['sender_ref', 'recepient_ref'],
            // select: {
            //   sender: true,
            //   recepient: true,
            // },
        });
        // Get user information for each participant in the chats
        const participants = yield Promise.all(inbox.map((chat) => __awaiter(void 0, void 0, void 0, function* () {
            const otherUserId = chat.sender_ref === req.user.id ? chat.recepient_ref : chat.sender_ref;
            const user = yield prisma.wreathe_user.findUnique({
                where: { user_uid: otherUserId },
            });
            return user;
        })));
        // Combine participants and directChats to create a list of one-to-one chats
        const oneToOneChats = participants.map((participant, index) => ({
            participant,
            lastMessage: inbox[index], // Assuming the messages are ordered by creation date
        }));
        return res.json({
            success: true,
            message: 'SUCCESSFULLY FETCHED INBOX',
            inbox,
            oneToOneChats,
        });
    }
    catch (err) {
        console.error(err);
        return res
            .status(403)
            .json({ success: false, message: 'Internal Server Error' });
    }
});
exports.inboxGet = inboxGet;
const inboxSearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('inbox search');
        return res.json({
            success: true,
            message: 'SUCCESSFULLY FETCHED INBOX',
        });
    }
    catch (err) {
        console.error(err);
        return res
            .status(403)
            .json({ success: false, message: 'Internal Server Error' });
    }
});
exports.inboxSearch = inboxSearch;
