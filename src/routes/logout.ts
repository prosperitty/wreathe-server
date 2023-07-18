import express, { Router } from 'express'
import { logoutPost } from '../controllers/logout-control'
const router: Router = express.Router()

router.post('/', logoutPost)

export default router
