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
    try {
        const { email, password } = req.body;
        // Authenticate the user by fetching user
        const user = {
            id: 123,
            email: 'email@email.com',
            password: 'password',
        };
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'invalid credentials' });
        }
        const secret = process.env.JWT_KEY;
        const payload = { id: user.id, email };
        // Generate an access token
        const accessToken = jwt.sign(payload, secret, { expiresIn: '2m' });
        // Generate a refresh token
        const refreshToken = jwt.sign(payload, secret, { expiresIn: '30m' });
        // Set refresh token as a secure HttpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            // httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });
        // Send the access token in the response
        res.json({ accessToken, message: 'auth passed' });
    }
    catch (err) {
        return next(err);
    }
});
exports.loginPost = loginPost;
