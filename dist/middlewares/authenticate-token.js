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
exports.authenticateToken = void 0;
const jwt = require("jsonwebtoken");
require("dotenv/config");
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        console.log('NO HEADERS SET');
        return res.status(401).json('No access token provided');
    }
    const accessToken = req.headers.authorization;
    const bearerToken = accessToken.split(' ')[1];
    const secret = process.env.JWT_KEY;
    try {
        const decoded = jwt.verify(bearerToken, secret);
        req.user = decoded;
    }
    catch (err) {
        console.error('THERE WAS AN ERROR AUTHENTICATING THE TOKEN', err);
        return res
            .status(403)
            .json({ error: 'no access token provided please login.' });
    }
    return next();
});
exports.authenticateToken = authenticateToken;
