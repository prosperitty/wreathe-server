"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesGet = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const messagesGet = (req, res) => {
    res.send('list of the users messages page');
};
exports.messagesGet = messagesGet;
