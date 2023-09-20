"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const refresh_token_1 = require("../controllers/refresh-token");
const logout_control_1 = require("../controllers/logout-control");
const router = express_1.default.Router();
router.post('/', refresh_token_1.refreshTokenPost);
router.post('/logout', logout_control_1.logoutPost);
exports.default = router;
