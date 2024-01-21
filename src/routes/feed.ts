import type { Request, Response, Router } from 'express'
import express from 'express'
import { authenticateToken } from '../middlewares/authenticate-token'
import { feedGet } from '../controllers/feed-control'
import { threadsGet } from '../controllers/threads-controller/threads-control'
const router: Router = express.Router()

/* GET home page. */
router.get('/', authenticateToken, feedGet)

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
