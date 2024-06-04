import express from 'express'
import type { Router } from 'express'
import { refreshTokenPost } from '../controllers/refresh-token'
import { logoutPost } from '../controllers/logout-control'
import { authenticateToken } from '../middlewares/authenticate-token'
const router: Router = express.Router()

router.post('/', authenticateToken, logoutPost)

router.post('/refresh-token', refreshTokenPost)

export default router
