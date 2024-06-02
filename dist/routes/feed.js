"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_token_1 = require("../middlewares/authenticate-token");
const feed_control_1 = require("../controllers/feed-control");
const router = express_1.default.Router();
router.get('/', authenticate_token_1.authenticateToken, feed_control_1.feedGet);
exports.default = router;
