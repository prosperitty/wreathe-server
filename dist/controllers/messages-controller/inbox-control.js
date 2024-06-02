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
exports.inboxGet = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const inboxGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inbox = yield prisma.message.findMany({
            where: {
                OR: [{ sender_ref: req.user.id }, { recepient_ref: req.user.id }],
            },
            // where: {
            //   sender_ref: req.user.id,
            // },
            orderBy: { message_timestamp: 'desc' },
            distinct: ['sender_ref', 'recepient_ref'],
            include: {
                sender: {
                    select: {
                        user_uid: true,
                        first_name: true,
                        last_name: true,
                        username: true,
                    },
                },
                recepient: {
                    select: {
                        user_uid: true,
                        first_name: true,
                        last_name: true,
                        username: true,
                    },
                },
            },
        });
        const messagePairs = [];
        for (let i = 0; i < inbox.length; i++) {
            const message = inbox[i];
            if (message.sender_ref === req.user.id ||
                message.recepient_ref === req.user.id) {
                const matchingMessage = inbox.find((msg) => (msg.sender_ref === message.recepient_ref &&
                    msg.recepient_ref === message.sender_ref) ||
                    (msg.recepient_ref === message.sender_ref &&
                        msg.sender_ref === message.recepient_ref));
                if (matchingMessage) {
                    messagePairs.push([message, matchingMessage]);
                    inbox.splice(inbox.indexOf(matchingMessage), 1);
                }
                else {
                    messagePairs.push([message]);
                }
            }
        }
        const inboxList = messagePairs.map((group) => {
            return group[0];
        });
        return res.json({
            success: true,
            message: 'SUCCESSFULLY FETCHED INBOX',
            inbox,
            inboxList,
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
