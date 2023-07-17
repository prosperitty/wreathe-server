"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwt = require("jsonwebtoken");
require("dotenv/config");
const authenticateToken = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ error: 'No access token provided' });
        }
        const accessToken = req.headers.authorization;
        const bearer = accessToken.split(' ');
        const bearerToken = bearer[1];
        const secret = process.env.JWT_KEY;
        jwt.verify(bearerToken, secret, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid access token' });
            }
            console.log(user, 'authenticate middleware');
            return next();
        });
    }
    catch (err) {
        return next(err);
    }
};
exports.authenticateToken = authenticateToken;
