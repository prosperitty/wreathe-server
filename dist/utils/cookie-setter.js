"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAccessToken = exports.setRefreshToken = void 0;
const setRefreshToken = (res, name, token, maxAge) => {
    if (process.env.NODE_ENV !== 'production') {
        const options = {
            // httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge,
            path: '/refresh-token',
        };
        return res.cookie(name, token, options);
    }
    else if (process.env.NODE_ENV === 'production') {
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge,
            path: '/refresh-token',
        };
        return res.cookie(name, token, options);
    }
};
exports.setRefreshToken = setRefreshToken;
const setAccessToken = (res, name, token, maxAge) => {
    if (process.env.NODE_ENV !== 'production') {
        const options = {
            // httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge,
            path: '/',
        };
        return res.cookie(name, token, options);
    }
    else if (process.env.NODE_ENV === 'production') {
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge,
            path: '/',
        };
        return res.cookie(name, token, options);
    }
};
exports.setAccessToken = setAccessToken;
