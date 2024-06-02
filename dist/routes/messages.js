"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_token_1 = require("../middlewares/authenticate-token");
const inbox_control_1 = require("../controllers/messages-controller/inbox-control");
const message_control_1 = require("../controllers/messages-controller/message-control");
const router = express_1.default.Router();
router.get('/', authenticate_token_1.authenticateToken, inbox_control_1.inboxGet);
router.get('/:recepientUsername', authenticate_token_1.authenticateToken, message_control_1.chatGet);
router.post('/:recepientUsername', authenticate_token_1.authenticateToken, message_control_1.messagePost);
// router.delete('/', authenticateToken, messageDelete)
// router.put('/', authenticateToken, messagePut)
exports.default = router;
