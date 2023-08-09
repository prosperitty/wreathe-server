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
exports.usersUpdate = exports.usersPost = exports.usersGet = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
/* GET users listing. */
const usersGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield prisma.wreathe_user.findMany();
    console.log(allUsers);
    res.json(allUsers);
});
exports.usersGet = usersGet;
const usersPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const encryptedPassword = yield bcryptjs_1.default.hash('johndoe', 10);
    yield prisma.wreathe_user.create({
        data: {
            first_name: 'john',
            last_name: 'doe',
            email: 'johndoe@gmail.com',
            username: 'johndoe',
            user_password: encryptedPassword,
            thread: {
                create: {
                    content: 'hello world',
                },
            },
        },
    });
    const allUsers = yield prisma.wreathe_user.findMany({
        include: {
            thread: true,
        },
    });
    console.log(allUsers);
    res.json(allUsers);
});
exports.usersPost = usersPost;
const usersUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const thread = yield prisma.thread.update({
        where: { thread_uid: ' ' },
        data: { content: 'hello world updated' },
    });
    console.log(thread);
    res.json(thread);
});
exports.usersUpdate = usersUpdate;
