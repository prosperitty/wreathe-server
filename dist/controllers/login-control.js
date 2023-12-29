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
const cookie_setter_1 = require("../utils/cookie-setter");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const loginGet = (req, res) => {
    res.send('login page');
};
exports.loginGet = loginGet;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!(username && password)) {
            console.error('MISSING CREDENTIALS!');
            return res.status(400).json({ message: 'MISSING CREDENTIALS' });
        }
        // Authenticate the user by fetching user from DB by username(username)
        const user = yield prisma.wreathe_user.findUnique({
            where: {
                username,
            },
        });
        if (!user) {
            console.error('USER DOES NOT EXIST!');
            return res.status(401).json({ error: 'USER DOES NOT EXIST!' });
        }
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.user_password);
        if (!passwordMatch) {
            console.error('PASSWORD DOES NOT MATCH!');
            return res.status(401).json({ error: 'PASSWORD DOES NOT MATCH' });
        }
        //Refresh token
        const secret = process.env.JWT_KEY;
        const payload = { id: user.user_uid, username: user.username };
        const accessToken = jwt.sign(payload, secret, { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, secret, { expiresIn: '1d' });
        //add refreshToken to user and store in DB?
        yield prisma.wreathe_user.update({
            where: { user_uid: user.user_uid },
            data: { refresh_token: refreshToken },
        });
        (0, cookie_setter_1.setAccessToken)(res, 'accessToken', accessToken, 60 * 60 * 1000);
        (0, cookie_setter_1.setRefreshToken)(res, 'refreshToken', refreshToken, 24 * 60 * 60 * 1000);
        // Send the access token in the response
        return res.json({ accessToken, userId: user.user_uid });
    }
    catch (err) {
        console.error('THERE WAS IN ISSUE LOGGING IN', err);
        return res
            .status(403)
            .json({ err, message: 'There was an issue logging in' });
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
