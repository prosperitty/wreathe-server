import type { Router } from 'express'
import express from 'express'
import { authenticateToken } from '../middlewares/authenticate-token'
import { feedGet } from '../controllers/feed-control'
const router: Router = express.Router()

router.get('/', authenticateToken, feedGet)

export default router
