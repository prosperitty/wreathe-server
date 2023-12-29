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
exports.usersThreadPage = exports.usersGet = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/* GET users listing. */
const usersGet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            console.error('YOU MUST BE SIGNED IN TO ACCESS THIS ROUTE!');
            const userData = yield prisma.wreathe_user.findUnique({
                where: { user_uid: req.params.userId },
                select: {
                    user_uid: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    username: true,
                },
            });
            const userThreads = yield prisma.thread.findMany({
                where: { author_ref: req.params.userId },
                include: {
                    wreathe_user: {
                        select: {
                            user_uid: true,
                            first_name: true,
                            last_name: true,
                            username: true,
                        },
                    },
                },
            });
            return res
                .status(401)
                .json({
                message: 'YOU MUST BE SIGNED IN TO ACCESS THIS ROUTE!',
                userData,
                userThreads,
            });
        }
    }
    catch (err) {
        console.error('THERE WAS AN ISSUE RENDERING THIS PAGE', err);
        return res.json({ err, message: 'THERE WAS AN ISSUE RENDERING THIS PAGE!' });
    }
    const userData = yield prisma.wreathe_user.findUnique({
        where: { user_uid: req.params.userId },
    });
    const userThreads = yield prisma.thread.findMany({
        where: { author_ref: req.params.userId },
        include: {
            wreathe_user: {
                select: {
                    user_uid: true,
                    first_name: true,
                    last_name: true,
                    username: true,
                },
            },
        },
    });
    return res.json({
        message: 'PROTECTED ROUTE ACCESSED SUCCESSFULLY',
        userData,
        userThreads,
    });
});
exports.usersGet = usersGet;
const usersThreadPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thread = yield prisma.thread.findUnique({
            where: { thread_uid: req.params.threadId, author_ref: req.params.userId },
            include: {
                wreathe_user: {
                    select: {
                        user_uid: true,
                        first_name: true,
                        last_name: true,
                        username: true,
                    },
                },
                // wreathe_user: true,
                comment: true,
            },
        });
        console.log(thread, '\n thread ==========================');
        return res.json({ thread });
    }
    catch (err) {
        console.error('THREAD NOT FOUND OR ISSUE FINDING THREAD');
        return res.json({
            err,
            message: 'THREAD NOT FOUND OR ISSUE FINDING THREAD',
        });
    }
});
exports.usersThreadPage = usersThreadPage;
