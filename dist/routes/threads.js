"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const threads_control_1 = require("../controllers/threads-controller/threads-control");
const router = express_1.default.Router();
/* GET home page. */
router.get('/', threads_control_1.threadsGet);
router.post('/compose', threads_control_1.threadsPost);
exports.default = router;
