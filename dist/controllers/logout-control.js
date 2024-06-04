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
        // THIS IS TEST CODE FOR SERVER ACTIONS ON THE CLIENT SIDE IN NEXT JS
        if (!req.headers.authorization) {
            console.error('NO HEADERS SET');
            throw new Error('NO REFRESH TOKEN PROVIDED IN HEADER.');
        }
        const refreshToken = req.headers.authorization;
        const bearerToken = refreshToken.split(' ')[1];
        // const refreshToken = req.cookies.refreshToken
        const secret = process.env.JWT_KEY;
        const decoded = jwt.verify(bearerToken, secret);
        const userId = decoded.id;
        // Logic here for also remove refreshtoken from db
        console.log(yield prisma.wreathe_user.update({
            where: { user_uid: userId },
            data: { refresh_token: null },
        }));
        //bug, can not logout without using /logout path because cookie can only be retrieved from this path
        res.clearCookie('refreshToken', { path: '/logout' });
        res.clearCookie('accessToken', { path: '/' });
        res.clearCookie('userData', { path: '/' });
        return res.json({
            success: true,
            message: 'Log Out Successful',
        });
    }
    catch (err) {
        console.error('THERE WAS AN ISSUE LOGGING OUT', err);
        return res
            .status(403)
            .json({ err, success: false, message: 'There was an issue logging out' });
    }
});
exports.logoutPost = logoutPost;
