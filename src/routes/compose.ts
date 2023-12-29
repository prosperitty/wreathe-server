import type { Router } from 'express'
import express from 'express'
import { threadsPost } from '../controllers/threads-controller/threads-control'
import { commentsPost } from '../controllers/threads-controller/comments-control'
import { authenticateToken } from '../middlewares/authenticate-token'
const router: Router = express.Router()

router.post('/thread', authenticateToken, threadsPost)

router.post('/comment/:threadid', authenticateToken, commentsPost)

export default router
