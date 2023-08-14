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
exports.logoutPost = void 0;
const jwt = require("jsonwebtoken");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const logoutPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshtoken;
        const secret = process.env.JWT_KEY;
        const decoded = jwt.verify(refreshToken, secret);
        const userId = decoded.id;
        // Logic here for also remove refreshtoken from db
        yield prisma.wreathe_user.update({
            where: { user_uid: userId },
            data: { refresh_token: null },
        });
        res.clearCookie('refreshToken', { path: '/refresh_token' });
        return res.json({
            message: 'Logged out',
        });
    }
    catch (err) {
        return res
            .status(403)
            .json({ err, message: 'There was an issue logging out' });
    }
});
exports.logoutPost = logoutPost;
