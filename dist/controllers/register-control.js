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
exports.registerPost = exports.registerGet = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
require("dotenv/config");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const registerGet = (req, res) => {
    res.send('register page');
};
exports.registerGet = registerGet;
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, username, password } = req.body;
    // Validate user input
    if (!(firstName && lastName && email && username && password)) {
        res.status(400).send('All input is required');
    }
    try {
        // Validate if user exist in our databaseS
        const found_username = yield prisma.wreathe_user.findUnique({
            where: { username },
            select: { username: true },
        });
        const found_email = yield prisma.wreathe_user.findUnique({
            where: { email },
            select: { email: true },
        });
        if (found_username) {
            return res.status(409).json({
                message: 'username is taken. try another username',
            });
        }
        else if (found_email) {
            return res.status(409).json({
                message: 'email is taken. try another email',
            });
        }
        //create new user and store in database
        const encryptedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield prisma.wreathe_user.create({
            data: {
                first_name: firstName,
                last_name: lastName,
                email: email,
                username: username,
                user_password: encryptedPassword,
            },
        });
        return res.json({ user, message: 'user successfully created' });
    }
    catch (err) {
        return res
            .status(403)
            .json({ err, message: 'There was an issue registering a new user' });
    }
});
exports.registerPost = registerPost;
// const user: NewUser = {
//   firstName,
//   lastName,
//   email,
//   password: encryptedPassword,
// }
