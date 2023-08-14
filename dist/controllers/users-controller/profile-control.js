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
exports.profileGet = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/* GET users listing. */
const profileGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundUser = yield prisma.wreathe_user.findUniqueOrThrow({
            //change the method to grab userid
            where: { user_uid: req.body.userId },
        });
        return res.json({ foundUser });
    }
    catch (err) {
        return res
            .status(403)
            .json({ err, message: 'There was an error fetching the user' });
    }
});
exports.profileGet = profileGet;
