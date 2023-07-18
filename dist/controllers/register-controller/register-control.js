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
const registerGet = (req, res) => {
    res.send('register page');
};
exports.registerGet = registerGet;
const registerPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = req.body;
    // Validate user input
    if (!(firstName && lastName && email && password)) {
        res.status(400).send('All input is required');
    }
    try {
        // check if user already exist
        // Validate if user exist in our database
        // if (found_username) {
        //   // username exists, redirect to signup page.
        //   res.status(409).json({
        //     message: 'username is taken. try another username',
        //     isValid: false,
        // })
        const encryptedPassword = yield bcryptjs_1.default.hash(password, 10);
        //create new user and store in database
        const user = {
            firstName,
            lastName,
            email,
            password: encryptedPassword,
        };
        return res.json({ user, message: 'user successfully created' });
    }
    catch (err) {
        return next(err);
    }
});
exports.registerPost = registerPost;
