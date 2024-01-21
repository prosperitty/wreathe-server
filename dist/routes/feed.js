"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_token_1 = require("../middlewares/authenticate-token");
const feed_control_1 = require("../controllers/feed-control");
const router = express_1.default.Router();
/* GET home page. */
router.get('/', authenticate_token_1.authenticateToken, feed_control_1.feedGet);
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
