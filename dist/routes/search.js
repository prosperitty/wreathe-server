"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const search_control_1 = require("../controllers/search-controller/search-control");
const router = express_1.default.Router();
router.post('/', search_control_1.searchForUser);
exports.default = router;
