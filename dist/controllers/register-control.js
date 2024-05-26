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
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
const registerGet = (req, res) => {
    res.send('register page');
};
exports.registerGet = registerGet;
exports.registerPost = [
    (0, express_validator_1.body)('first_name', 'First name is required')
        .trim()
        .isLength({ min: 1, max: 30 })
        .notEmpty()
        .withMessage('Can not be empty. Maximum characters is 30.'),
    (0, express_validator_1.body)('last_name', 'Last name is required')
        .trim()
        .isLength({ min: 1, max: 30 })
        .notEmpty()
        .withMessage('Can not be empty. Maximum characters is 30.'),
    (0, express_validator_1.body)('username', 'Username is required')
        .trim()
        .toLowerCase()
        .isLowercase()
        .isLength({ min: 1, max: 50 })
        .notEmpty()
        .withMessage('Can not be empty. Maximum characters is 50.'),
    (0, express_validator_1.body)('password')
        .trim()
        .isLength({ min: 1, max: 100 })
        .notEmpty()
        .withMessage('Maximum characters is 100.'),
    (0, express_validator_1.body)('email')
        .trim()
        .normalizeEmail({ all_lowercase: true })
        .isEmail()
        .isLength({ max: 100 }),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        const { first_name, last_name, username, password, email } = req.body;
        console.log(req.body);
        if (!errors.isEmpty()) {
            console.error('VALIDATION FAILURE:', errors.array());
            return res.json({
                first_name,
                last_name,
                username,
                password,
                email,
                errors: errors.array(),
            });
        }
        // Validate user input
        if (!(first_name && last_name && email && username && password)) {
            return res.status(400).json({
                first_name,
                last_name,
                username,
                password,
                email,
                message: 'All input is required',
            });
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
            yield prisma.wreathe_user.create({
                data: {
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    username: username,
                    user_password: encryptedPassword,
                },
            });
            return res.json({ message: 'user successfully created' });
        }
        catch (err) {
            return res
                .status(403)
                .json({ err, message: 'There was an issue registering a new user' });
        }
    }),
];
// const user: NewUser = {
//   first_name,
//   last_name,
//   email,
//   password: encryptedPassword,
// }
