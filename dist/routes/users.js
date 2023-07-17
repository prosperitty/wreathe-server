"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authenticate_token_1 = require("../middlewares/authenticate-token");
const jwt = require("jsonwebtoken");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// interface userRequest extends Request {
//   user: any
// }
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource hello world');
});
// router.post('/', function (req: Request, res: Response, next: NextFunction) {
//   // Authenticate the user
//   interface User {
//     id: number
//     username: string
//   }
//   const user: User = {
//     id: 123,
//     username: 'example_user1',
//   }
//   // Generate a JWT
//   jwt.sign(
//     user,
//     process.env.JWT_KEY,
//     { expiresIn: 30 },
//     (err: JsonWebTokenError, token: string) => {
//       if (err) {
//         res.status(500).json({ error: 'Failed to generate token' })
//       } else {
//         res.json({ token })
//       }
//     },
//   )
// })
// function authenticateToken(req: any, res: Response, next: NextFunction) {
//   const token = req.headers.authorization
//   if (!token) {
//     return res.status(401).json({ error: 'No token provided' })
//   }
//   const bearer = token.split(' ')
//   const bearerToken = bearer[1]
//   req.token = bearerToken
//   return next()
// }
router.get('/protected', authenticate_token_1.authenticateToken, (req, res) => {
    res.json({ message: 'protected route accessed successfully' });
    // Access the authenticated user via req.user
});
router.post('/refresh-token', (req, res, next) => {
    const refreshToken = req.cookies.refreshtoken;
    // If we don't have a token in our request
    if (!refreshToken) {
        return res.status(401).json({ error: 'no refresh token provided!' });
    }
    // We have a token, let's verify it!
    const secret = process.env.JWT_KEY;
    jwt.verify(refreshToken, secret, (err, decoded) => {
        if (err) {
            return res
                .status(403)
                .json({ error: 'Failed to authenticate refresh token' });
        }
        console.log(decoded, 'decoded user should be set to user. just set the user variable declaration to the jwt verify function and return decoded from the function');
    });
    const user = {
        id: '123',
        email: 'email@email.com',
        refreshToken: refreshToken,
    };
    // token is valid, check if user exist
    // const user = fakeDB.find(user => user.id === payload.userId);
    if (!user) {
        return res.status(401).json({ error: 'User does not exist' });
    }
    // user exist, check if refreshtoken exist on user
    if (user.refreshToken !== refreshToken) {
        return res
            .status(401)
            .json({ error: 'The user does not have a refresh token!' });
    }
    try {
        // token exist, create new Refresh- and accesstoken
        const newAccessToken = jwt.sign(user.id, secret, { expiresIn: '2m' });
        const newRefreshToken = jwt.sign(user.id, secret, { expiresIn: '30m' });
        // update refreshtoken on user in db
        // Could have different versions instead!
        user.refreshToken = newRefreshToken;
        // All good to go, send new refreshtoken and accesstoken
        res.cookie('refreshToken', newRefreshToken, {
            // httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });
        return res.send({ newAccessToken });
    }
    catch (err) {
        return next(err);
    }
});
exports.default = router;
