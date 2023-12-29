import type { Request, Response, Router } from 'express'
import express from 'express'
import { authenticateToken } from '../middlewares/authenticate-token'
import { feedGet } from '../controllers/feed-control'
import { threadsGet } from '../controllers/threads-controller/threads-control'
const router: Router = express.Router()

/* GET home page. */
router.get('/', authenticateToken, threadsGet)

export default router
