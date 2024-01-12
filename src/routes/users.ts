import express from 'express'
import type { NextFunction, Request, Response, Router } from 'express'
import { authenticateToken } from '../middlewares/authenticate-token'
import {
  usersGet,
  usersThreadPage,
} from '../controllers/users-controller/users-control'
import { threadsGet } from '../controllers/threads-controller/threads-control'
import {
  likeComment,
  likeThread,
  unlikeComment,
  unlikeThread,
} from '../controllers/threads-controller/like-control'
import {
  followPost,
  followersGet,
  followingGet,
  unFollowPost,
} from '../controllers/users-controller/follow-control'
const router: Router = express.Router()

/* GET users listing. */
router.get('/:userId', authenticateToken, usersGet)
router.get('/:userId/threads', authenticateToken, threadsGet)
router.get('/:userId/following', followingGet)
router.get('/:userId/followers', followersGet)
router.post('/:userId/follow', authenticateToken, followPost)
router.post('/:userId/unfollow', authenticateToken, unFollowPost)

router.get('/:userId/threads/:threadId', authenticateToken, usersThreadPage)
router.post('/:userId/threads/:threadId/likes', authenticateToken, likeThread)
router.delete(
  '/:userId/threads/:threadId/unlike',
  authenticateToken,
  unlikeThread,
)

router.get('/:userId/threads/:threadId/comments')

router.get('/:userId/threads/:threadId/comments/:commentId')
router.post(
  '/:userId/threads/:threadId/comments/:commentId/like',
  authenticateToken,
  likeComment,
)
router.delete(
  '/:userId/threads/:threadId/comments/:commentId/unlike',
  authenticateToken,
  unlikeComment,
)

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
