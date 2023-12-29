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
exports.feedGet = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/* GET users listing. */
const feedGet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            console.error('YOU MUST BE SIGNED IN TO ACCESS YOUR FEED!');
            return res.status(401).json('YOU MUST BE SIGNED IN TO ACCESS YOUR FEED!');
        }
    }
    catch (err) {
        console.error('THERE WAS AN ISSUE RENDERING THIS PAGE', err);
        return res.json({ err, message: 'THERE WAS AN ISSUE RENDERING THIS PAGE!' });
    }
    return res.json({ message: 'PROTECTED ROUTE ACCESSED SUCCESSFULLY' });
});
exports.feedGet = feedGet;
