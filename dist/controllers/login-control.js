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
const jwt = require("jsonwebtoken");
require("dotenv/config");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const loginGet = (req, res) => {
    res.send('login page');
};
exports.loginGet = loginGet;
const loginPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!(username && password)) {
            return res.status(400).json({ message: 'MISSING CREDENTIALS' });
        }
        // Authenticate the user by fetching user from DB by username(username)
        const user = yield prisma.wreathe_user.findUnique({
            where: {
                username,
            },
        });
        if (!user) {
            return res.status(401).json({ error: 'USER DOES NOT EXIST!' });
        }
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.user_password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'PASSWORD DOES NOT MATCH' });
        }
        //Refresh token
        const secret = process.env.JWT_KEY;
        const payload = { id: user.user_uid };
        const accessToken = jwt.sign(payload, secret, { expiresIn: '5m' });
        const refreshToken = jwt.sign(payload, secret, { expiresIn: '30m' });
        //add refreshToken to user and store in DB?
        yield prisma.wreathe_user.update({
            where: { user_uid: user.user_uid },
            data: { refresh_token: refreshToken },
        });
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
