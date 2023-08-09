"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_control_js_1 = require("../controllers/login-control.js");
const router = express_1.default.Router();
router.get('/', login_control_js_1.loginGet);
router.post('/', login_control_js_1.loginPost);
exports.default = router;
