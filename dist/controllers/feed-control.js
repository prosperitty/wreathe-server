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
exports.feedGet = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/* GET users listing. */
const feedGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const followingUsers = yield prisma.follower.findMany({
            where: {
                followerId: user.id,
            },
            select: {
                followingId: true,
            },
        });
        const threads = yield prisma.thread.findMany({
            where: {
                ispublished: true,
                OR: [
                    {
                        author_ref: {
                            in: followingUsers.map(followedUser => followedUser.followingId),
                        },
                    },
                    {
                        author_ref: user.id,
                    },
                ],
            },
            orderBy: {
                thread_timestamp: 'desc',
            },
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
        return res.json({ threads });
    }
    catch (err) {
        console.error(err);
        res.status(403).json({ err, message: 'there was an issue fetching posts' });
    }
});
exports.feedGet = feedGet;
