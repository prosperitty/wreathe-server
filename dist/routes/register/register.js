"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const register_control_js_1 = require("../../controllers/register-controller/register-control.js");
const router = express_1.default.Router();
/* GET users listing. */
router.get('/', register_control_js_1.registerGet);
router.post('/', register_control_js_1.registerPost);
// function authenticateToken(req: any, res: Response, next: NextFunction) {
//   const token = req.headers.authorization
//   if (!token) {
//     return res.status(401).json({ error: 'No token provided' })
//   }
//   const bearer = token.split(' ')
//   const bearerToken = bearer[1]
//   req.token = bearerToken
//   return next()
// }
// router.get('/protected', authenticateToken, (req: any, res: Response) => {
//   jwt.verify(
//     req.token,
//     process.env.JWT_KEY,
//     (err: JsonWebTokenError, user: any) => {
//       if (err) {
//         return res.status(403).json({ error: 'Invalid token' })
//       }
//       res.send({ message: 'Protected route accessed successfully', user })
//     }
//   )
//   // Access the authenticated user via req.user
// })
exports.default = router;
