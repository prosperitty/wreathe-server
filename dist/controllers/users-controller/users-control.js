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
const usersGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            console.error('YOU MUST BE SIGNED IN TO ACCESS THIS ROUTE!');
            const profileData = yield prisma.wreathe_user.findUnique({
                where: { user_uid: req.params.userId },
                select: {
                    user_uid: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    username: true,
                    thread: true,
                    comment: true,
                    likes: true,
                    comment_likes: true,
                    followers: true,
                    following: true,
                },
            });
            const profileThreads = yield prisma.thread.findMany({
                where: { author_ref: req.params.userId },
                include: {
                    comment: true,
                    likes: true,
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
            const profileComments = yield prisma.comment.findMany({
                where: { author_ref: req.params.userId, ispublished: true },
                include: {
                    thread: true,
                    comment_likes: true,
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
            const profileLikes = yield prisma.likes.findMany({
                where: { user_uid: req.params.userId },
                include: {
                    thread: {
                        include: {
                            wreathe_user: true,
                            comment: true,
                            likes: true,
                        },
                    },
                },
            });
            return res.status(401).json({
                message: 'YOU MUST BE SIGNED IN TO ACCESS THIS ROUTE!',
                profileData,
                profileThreads,
                profileComments,
                profileLikes,
            });
        }
        else {
            const profileData = yield prisma.wreathe_user.findUnique({
                where: { user_uid: req.params.userId.toString() },
                include: {
                    thread: true,
                    comment: true,
                    likes: true,
                    comment_likes: true,
                    followers: true,
                    following: true,
                },
            });
            const profileThreads = yield prisma.thread.findMany({
                where: { author_ref: req.params.userId },
                include: {
                    comment: true,
                    likes: true,
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
            const profileComments = yield prisma.comment.findMany({
                where: { author_ref: req.params.userId, ispublished: true },
                include: {
                    thread: true,
                    comment_likes: true,
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
            const profileLikes = yield prisma.likes.findMany({
                where: { user_uid: req.params.userId },
                include: {
                    thread: {
                        include: {
                            wreathe_user: true,
                            comment: true,
                            likes: true,
                        },
                    },
                },
            });
            return res.json({
                message: 'PROTECTED ROUTE ACCESSED SUCCESSFULLY',
                profileData,
                profileThreads,
                profileComments,
                profileLikes,
            });
        }
    }
    catch (err) {
        console.error('THERE WAS AN ISSUE RENDERING THIS PAGE', err);
        return res.json({ err, message: 'THERE WAS AN ISSUE RENDERING THIS PAGE!' });
    }
});
exports.usersGet = usersGet;
const usersThreadPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let isLike = false;
    try {
        const thread = yield prisma.thread.findUnique({
            where: { thread_uid: req.params.threadId, author_ref: req.params.userId },
            include: {
                comment: {
                    include: {
                        thread: true,
                        wreathe_user: true,
                        comment_likes: true,
                    },
                },
                likes: true,
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
        if (user) {
            const userLike = yield prisma.likes.findUnique({
                where: {
                    user_uid_thread_uid: {
                        user_uid: req.user.id,
                        thread_uid: req.params.threadId,
                    },
                },
            });
            isLike = Boolean(userLike);
        }
        return res.json({ thread, isLike });
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
