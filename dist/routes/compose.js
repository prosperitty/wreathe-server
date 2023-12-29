"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const threads_control_1 = require("../controllers/threads-controller/threads-control");
const comments_control_1 = require("../controllers/threads-controller/comments-control");
const authenticate_token_1 = require("../middlewares/authenticate-token");
const router = express_1.default.Router();
router.post('/thread', authenticate_token_1.authenticateToken, threads_control_1.threadsPost);
router.post('/comment/:threadid', authenticate_token_1.authenticateToken, comments_control_1.commentsPost);
exports.default = router;
