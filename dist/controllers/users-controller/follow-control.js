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
exports.followersGet = exports.followingGet = exports.unFollowPost = exports.followPost = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const followPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        // Check if followerId and followingId are different
        if (user.id === req.params.userId) {
            console.log('Cannot follow yourself');
            return res
                .status(400)
                .json({ success: false, message: 'Cannot follow yourself' });
        }
        // Use Prisma to create a follower relationship
        const follower = yield prisma.follower.create({
            data: {
                followerId: user.id,
                followingId: req.params.userId,
            },
        });
        res.json({ success: true, message: 'User followed successfully', follower });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
exports.followPost = followPost;
const unFollowPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        // Check if followerId and followingId are different
        if (user.id === req.params.userId) {
            return res
                .status(400)
                .json({ success: false, message: 'Cannot unfollow yourself' });
        }
        // Use Prisma to create a follower relationship
        const unfollower = yield prisma.follower.delete({
            where: {
                followerId_followingId: {
                    followerId: user.id,
                    followingId: req.params.userId,
                },
            },
        });
        res.json({
            success: true,
            message: 'User unfollowed successfully',
            unfollower,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
exports.unFollowPost = unFollowPost;
const followingGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followingUsers = yield prisma.follower.findMany({
            where: {
                followerId: req.params.userId,
            },
            select: {
                following: true,
            },
        });
        const following = followingUsers.map(item => item.following);
        return res.json({
            success: true,
            message: 'Following Users fetched successfully===',
            following,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
exports.followingGet = followingGet;
const followersGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followerUsers = yield prisma.follower.findMany({
            where: {
                followingId: req.params.userId,
            },
            select: {
                follower: true,
            },
        });
        const followers = followerUsers.map(item => item.follower);
        return res.json({
            success: true,
            message: 'Follower Users fetched successfully',
            followers,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
exports.followersGet = followersGet;
