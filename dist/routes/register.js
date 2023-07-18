"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const register_control_js_1 = require("../controllers/register-controller/register-control.js");
const router = express_1.default.Router();
router.get('/', register_control_js_1.registerGet);
router.post('/', register_control_js_1.registerPost);
exports.default = router;
