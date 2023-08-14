import express from 'express'
import type { NextFunction, Request, Response, Router } from 'express'
import { authenticateToken } from '../middlewares/authenticate-token'
import { usersGet } from '../controllers/users-controller/users-control'
import { refreshTokenPost } from '../controllers/users-controller/refresh-token'
const router: Router = express.Router()

/* GET users listing. */
router.get('/', usersGet)

router.post('/refresh-token', refreshTokenPost)

/* GET protected route test route */
router.get(
  '/protected',
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user
      console.log(user, '\n req user')
      if (!user) {
        res.status(401).json('protected route')
      }
    } catch (err) {
      return next(err)
    }
    res.json({ message: 'protected route accessed successfully' })
    // Access the authenticated user via req.user
  },
)

export default router
