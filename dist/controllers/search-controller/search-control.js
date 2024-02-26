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
exports.searchForUser = void 0;
const express_validator_1 = require("express-validator");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.searchForUser = [
    (0, express_validator_1.body)('searchTerm')
        .trim()
        .toLowerCase()
        .isLowercase()
        .isLength({ min: 1, max: 50 })
        .notEmpty()
        .withMessage('Can not be empty. Maximum characters is 50.'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            const searchTerm = req.body.searchTerm;
            const searchedUsers = yield prisma.wreathe_user.findMany({
                where: {
                    username: {
                        startsWith: searchTerm, // Case-insensitive search
                    },
                },
                orderBy: {
                    username: 'asc', // Sorting usernames in ascending order
                },
                take: 12,
            });
            if (!errors.isEmpty()) {
                console.error('VALIDATION FAILURE:', errors.array());
                return res.json({ searchTerm, errors: errors.array() });
            }
            return res.json({
                success: true,
                message: 'SUCCESSFULLY FETCHED FILTERED USERS BY SEARCH TERM',
                searchedUsers,
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
