import express from 'express'
import type { Router } from 'express'
import { refreshTokenPost } from '../controllers/refresh-token'
import { logoutPost } from '../controllers/logout-control'
const router: Router = express.Router()

router.post('/', refreshTokenPost)

router.post('/logout', logoutPost)

export default router
