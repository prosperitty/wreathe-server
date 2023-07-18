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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// import { User } from '../../types'
const jwt = require("jsonwebtoken");
require("dotenv/config");
const loginGet = (req, res) => {
    res.cookie('cookie set', 'this');
    res.send('login page');
};
exports.loginGet = loginGet;
const loginPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Authenticate the user by fetching user from DB by username(email)
        const encryptedPassword = yield bcryptjs_1.default.hash('password', 10);
        const user = {
            id: '123',
            firstName: 'first',
            lastName: 'last',
            email: email,
            password: encryptedPassword,
            refreshToken: null,
        };
        if (!user) {
            return res.status(401).json({ error: 'USER DOES NOT EXIST!' });
        }
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'PASSWORD NOT CORRECT' });
        }
        const secret = process.env.JWT_KEY;
        const payload = { id: user.id };
        const accessToken = jwt.sign(payload, secret, { expiresIn: '5m' });
        const refreshToken = jwt.sign(payload, secret, { expiresIn: '30m' });
        //add refreshToken to user and store in DB?
        user.refreshToken = refreshToken;
        //save to db
        // Set refresh token as a secure HttpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            // httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/refresh-token',
        });
        // Send the access token in the response
        return res.json({ accessToken });
    }
    catch (err) {
        return next(err);
    }
});
exports.loginPost = loginPost;
