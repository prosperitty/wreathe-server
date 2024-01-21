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
exports.settingsPost = exports.settingsGet = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
const settingsGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.wreathe_user.findUniqueOrThrow({
            //change the method to grab userid
            where: { user_uid: req.user.id },
        });
        return res.json({
            success: true,
            message: 'Signed In User Fetched Successfully',
            user,
        });
    }
    catch (err) {
        console.error(err);
        return res
            .status(403)
            .json({ success: false, message: 'Internal Server Error' });
    }
});
exports.settingsGet = settingsGet;
exports.settingsPost = [
    (0, express_validator_1.body)('firstName', 'First name is required')
        .trim()
        .isLength({ min: 1, max: 30 })
        .notEmpty()
        .withMessage('Can not be empty. Maximum characters is 30.'),
    (0, express_validator_1.body)('lastName', 'Last name is required')
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
        .optional({ values: 'falsy' || 'null' || 'undefined' })
        .trim()
        .isLength({ min: 1 })
        .withMessage('Maximum characters is 100.'),
    (0, express_validator_1.body)('email')
        .trim()
        .normalizeEmail({ all_lowercase: true })
        .isEmail()
        .isLength({ max: 100 }),
    (0, express_validator_1.body)('bio').optional().trim().isLength({ max: 150 }),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            const updatedUserData = {
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                email: req.body.email,
                username: req.body.username,
                user_password: req.body.password,
                bio: req.body.bio,
            };
            if (!errors.isEmpty()) {
                console.error('VALIDATION FAILURE:', errors.array());
                return res.json({ updatedUserData, errors: errors.array() });
            }
            const existingUser = yield prisma.wreathe_user.findUnique({
                where: { user_uid: req.user.id },
            });
            if (!existingUser) {
                console.error('USER NOT FOUND');
                return res.status(404).json({ error: 'User not found' });
            }
            const existingUsername = yield prisma.wreathe_user.findUnique({
                where: { username: req.body.username },
            });
            if (!existingUsername) {
                console.error('USERNAME IS ALREADY TAKEN');
                return res.status(404).json({ error: 'Username is already taken' });
            }
            const existingEmail = yield prisma.wreathe_user.findUnique({
                where: { email: req.body.email },
            });
            if (!existingEmail) {
                console.error('EMAIL IS ALREADY TAKEN');
                return res.status(404).json({ error: 'Email is already taken' });
            }
            if (req.body.password) {
                const newPassword = req.body.password;
                const isMatch = yield bcryptjs_1.default.compare(newPassword, existingUser.user_password);
                if (isMatch) {
                    console.error('NEW PASSWORD MUST BE DIFFERENT FROM PREVIOUS PASSWORD');
                    return res.status(400).json({
                        error: 'New password must be different from the previous password',
                    });
                }
                const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
                updatedUserData.user_password = hashedPassword;
            }
            else {
                updatedUserData.user_password = existingUser.user_password;
            }
            const updatedUser = yield prisma.wreathe_user.update({
                where: { user_uid: req.user.id },
                data: updatedUserData,
            });
            const userURL = `users/${updatedUser.user_uid}`;
            console.log(updatedUser, 'updated user');
            return res.json({
                success: true,
                message: 'User settings updated successfully',
                updatedUser,
                userURL,
            });
        }
        catch (err) {
            console.error(err);
            return res
                .status(403)
                .json({ success: false, message: 'Internal Server Error' });
        }
    }),
];
