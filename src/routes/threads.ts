import type { Router } from 'express'
import express from 'express'
import {
  threadsGet,
  threadsPost,
} from '../controllers/threads-controller/threads-control'
const router: Router = express.Router()

/* GET home page. */
router.get('/', threadsGet)

router.post('/compose', threadsPost)

export default router
