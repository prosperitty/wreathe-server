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
exports.unlikeComment = exports.likeComment = exports.unlikeThread = exports.likeThread = void 0;
const client_1 = require("@prisma/client");
// import cloudinary from '../../utils/cloudinary'
const prisma = new client_1.PrismaClient();
const likeThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const threadId = req.params.threadId;
    const userId = req.user.id; // Assuming you pass the user ID in the request body
    try {
        // Check if the thread exists
        const thread = yield prisma.thread.findUnique({
            where: { thread_uid: threadId },
        });
        if (!thread) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // Check if the user has already liked the thread
        const existingLike = yield prisma.likes.findFirst({
            where: { thread_uid: threadId, user_uid: userId },
        });
        if (existingLike) {
            console.error('User has already liked the thread');
            return res
                .status(400)
                .json({ error: 'User has already liked the thread' });
        }
        // Create a new like
        const newLike = yield prisma.likes.create({
            data: {
                thread_uid: threadId,
                user_uid: userId,
            },
        });
        // Update the thread's likes
        const updatedPost = yield prisma.thread.update({
            where: { thread_uid: threadId },
            data: {
                likes: {
                    connect: {
                        user_uid_thread_uid: {
                            user_uid: newLike.user_uid,
                            thread_uid: newLike.thread_uid,
                        },
                    },
                },
            },
            include: {
                likes: true, // Include the likes in the response
            },
        });
        console.log(updatedPost);
        res.status(200).json(updatedPost);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.likeThread = likeThread;
const unlikeThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const threadId = req.params.threadId;
    const userId = req.user.id; // Assuming you pass the user ID in the request body
    try {
        // Check if the thread exists
        const thread = yield prisma.thread.findUnique({
            where: { thread_uid: threadId },
        });
        if (!thread) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // Check if the user has liked the thread
        const existingLike = yield prisma.likes.findFirst({
            where: { thread_uid: threadId, user_uid: userId },
        });
        if (!existingLike) {
            return res.status(400).json({ error: 'User has not liked the thread' });
        }
        // Delete the like
        yield prisma.likes.delete({
            where: {
                user_uid_thread_uid: {
                    thread_uid: existingLike.thread_uid,
                    user_uid: existingLike.user_uid,
                },
            },
        });
        const updatedPost = yield prisma.thread.findUnique({
            where: { thread_uid: threadId },
            include: {
                likes: true, // Include the likes in the response
            },
        });
        console.log(updatedPost);
        res.status(200).json(updatedPost);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.unlikeThread = unlikeThread;
const likeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    const userId = req.user.id; // Assuming you pass the user ID in the request body
    try {
        // Check if the comment exists
        const comment = yield prisma.comment.findUnique({
            where: { comment_uid: commentId },
        });
        if (!comment) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // Check if the user has already liked the comment
        const existingLike = yield prisma.comment_likes.findFirst({
            where: { comment_uid: commentId, user_uid: userId },
        });
        if (existingLike) {
            console.error('User has already liked the comment');
            return res
                .status(400)
                .json({ error: 'User has already liked the comment' });
        }
        // Create a new like
        const newLike = yield prisma.comment_likes.create({
            data: {
                comment_uid: commentId,
                user_uid: userId,
            },
        });
        // Update the comment's comment_likes
        const updatedPost = yield prisma.comment.update({
            where: { comment_uid: commentId },
            data: {
                comment_likes: {
                    connect: {
                        user_uid_comment_uid: {
                            user_uid: newLike.user_uid,
                            comment_uid: newLike.comment_uid,
                        },
                    },
                },
            },
            include: {
                comment_likes: true, // Include the comment_likes in the response
            },
        });
        console.log(updatedPost);
        res.status(200).json(updatedPost);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.likeComment = likeComment;
const unlikeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    const userId = req.user.id; // Assuming you pass the user ID in the request body
    try {
        // Check if the comment exists
        const comment = yield prisma.comment.findUnique({
            where: { comment_uid: commentId },
        });
        if (!comment) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // Check if the user has liked the comment
        const existingLike = yield prisma.comment_likes.findFirst({
            where: { comment_uid: commentId, user_uid: userId },
        });
        if (!existingLike) {
            return res.status(400).json({ error: 'User has not liked the comment' });
        }
        // Delete the like
        yield prisma.comment_likes.delete({
            where: {
                user_uid_comment_uid: {
                    comment_uid: existingLike.comment_uid,
                    user_uid: existingLike.user_uid,
                },
            },
        });
        const updatedPost = yield prisma.comment.findUnique({
            where: { comment_uid: commentId },
            include: {
                comment_likes: true, // Include the comment_likes in the response
            },
        });
        console.log(updatedPost);
        res.status(200).json(updatedPost);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.unlikeComment = unlikeComment;
