import express from 'express'
import {
  loginGet,
  loginPost,
} from '../../controllers/login-controller/login-control.js'
const router = express.Router()

/* GET users listing. */
router.get('/', loginGet)

router.post('/', loginPost)

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

export default router
