"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_token_1 = require("../middlewares/authenticate-token");
const users_control_1 = require("../controllers/users-controller/users-control");
const refresh_token_1 = require("../controllers/users-controller/refresh-token");
const router = express_1.default.Router();
/* GET users listing. */
router.get('/', users_control_1.usersGet);
router.post('/refresh-token', refresh_token_1.refreshTokenPost);
/* GET protected route test route */
router.get('/protected', authenticate_token_1.authenticateToken, (req, res, next) => {
    try {
        const user = req.user;
        console.log(user, '\n req user');
        if (!user) {
            res.status(401).json('protected route');
        }
    }
    catch (err) {
        return next(err);
    }
    res.json({ message: 'protected route accessed successfully' });
    // Access the authenticated user via req.user
});
exports.default = router;
