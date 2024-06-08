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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginPost = exports.loginGet = void 0;
// eslint-disable-next-line import/default
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt = require("jsonwebtoken");
require("dotenv/config");
// import {
//   setAccessToken,
//   setRefreshToken,
//   setUserData,
// } from '../utils/cookie-setter'
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const loginGet = (req, res) => {
    res.send('login page');
};
exports.loginGet = loginGet;
const secretKey = process.env.JWT_KEY;
// const encodedKey = new TextEncoder().encode(secret)
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!(username && password)) {
            console.error('MISSING CREDENTIALS!');
            return res.status(400).json({ errorMessage: 'MISSING CREDENTIALS' });
        }
        // Authenticate the user by fetching user from DB by username(username)
        const user = yield prisma.wreathe_user.findUnique({
            where: {
                username,
            },
        });
        if (!user) {
            console.error('INVALID USERNAME OR PASSWORD');
            return res
                .status(401)
                .json({ errorMessage: 'INVALID USERNAME OR PASSWORD' });
        }
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.user_password);
        if (!passwordMatch) {
            console.error('INVALID USERNAME OR PASSWORD');
            return res
                .status(401)
                .json({ errorMessage: 'INVALID USERNAME OR PASSWORD' });
        }
        //Refresh token
        const payload = { id: user.user_uid, username: user.username };
        const accessToken = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, secretKey, { expiresIn: '1d' });
        //add refreshToken to user and store in DB?
        yield prisma.wreathe_user.update({
            where: { user_uid: user.user_uid },
            data: { refresh_token: refreshToken },
        });
        const userData = {
            user_uid: user.user_uid,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            username: user.username,
        };
        // setAccessToken(res, 'accessToken', accessToken, 60 * 60 * 1000)
        // setRefreshToken(res, 'refreshToken', refreshToken, 24 * 60 * 60 * 1000)
        // setUserData(res, 'userData', JSON.stringify(userData), 24 * 60 * 60 * 1000)
        // Send the access token in the response
        return res.json({
            success: true,
            message: 'Login Successful',
            accessToken,
            refreshToken,
            userData,
        });
    }
    catch (error) {
        console.error('THERE WAS IN ISSUE SIGNING IN', error);
        return res.status(403).json({
            error,
            success: false,
            message: 'Something went wrong, try again.',
            errorMessage: `THERE WAS AN ISSUE SIGNING IN: ${error}`,
        });
    }
});
exports.loginPost = loginPost;
//FAKE USER ONLY MAKE SURE TO DELETE
// const encryptedPassword = await bcrypt.hash('password', 10)
// const user: User = {
//   id: '123',
//   firstName: 'first',
//   lastName: 'last',
//   email: email,
//   password: encryptedPassword,
//   refreshToken: null!,
// }
// user.refreshToken = refreshToken
