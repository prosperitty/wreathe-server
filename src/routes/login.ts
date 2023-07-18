import express from 'express'
import { loginGet, loginPost } from '../controllers/login-control.js'
const router = express.Router()

router.get('/', loginGet)

router.post('/', loginPost)

export default router
