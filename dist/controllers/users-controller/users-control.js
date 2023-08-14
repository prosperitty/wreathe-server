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
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersGet = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/* GET users listing. */
const usersGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield prisma.wreathe_user.findMany();
    console.log(allUsers);
    res.json(allUsers);
});
exports.usersGet = usersGet;
