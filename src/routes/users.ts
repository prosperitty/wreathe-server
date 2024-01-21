import express from 'express'
import type { Router } from 'express'
import { authenticateToken } from '../middlewares/authenticate-token'
import { threadsGet } from '../controllers/threads-controller/threads-control'
import {
  settingsGet,
  settingsPost,
} from '../controllers/users-controller/settings-control'
import {
  usersGet,
  usersThreadPage,
} from '../controllers/users-controller/users-control'
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

router.get('/:userId', authenticateToken, usersGet)
router.get('/:userId/threads', authenticateToken, threadsGet)
router.get('/:userId/following', followingGet)
router.get('/:userId/followers', followersGet)
router.get('/:userId/settings', authenticateToken, settingsGet)
router.post('/:userId/settings', authenticateToken, settingsPost)
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

export default router
