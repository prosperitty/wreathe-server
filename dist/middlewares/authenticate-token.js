"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwt = require("jsonwebtoken");
require("dotenv/config");
const authenticateToken = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: 'No access token provided' });
    }
    const accessToken = req.headers.authorization;
    const bearerToken = accessToken.split(' ')[1];
    const secret = process.env.JWT_KEY;
    try {
        const decoded = jwt.verify(bearerToken, secret);
        req.user = decoded;
    }
    catch (err) {
        return res.status(403).json({ error: 'expired access token' });
    }
    return next();
};
exports.authenticateToken = authenticateToken;
