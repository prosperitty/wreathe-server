import express from 'express'
import type { NextFunction, Request, Response, Router } from 'express'
import { authenticateToken } from '../middlewares/authenticate-token'
import { usersGet } from '../controllers/users-controller/users-control'
const router: Router = express.Router()

/* GET users listing. */
router.get('/:userId', authenticateToken, usersGet)

router.get('/:userId/threads')

router.get('/:userId/threads/:threadId')

router.get('/:userId/threads/:threadId/comments')

router.get('/:userId/threads/:threadId/comments/:commentId')

router.get('/:userId/likes')

router.get('/:userId/settings/profile')

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
