"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_token_1 = require("../middlewares/authenticate-token");
const threads_control_1 = require("../controllers/threads-controller/threads-control");
const router = express_1.default.Router();
/* GET home page. */
router.get('/', authenticate_token_1.authenticateToken, threads_control_1.threadsGet);
exports.default = router;
