import type { Router } from 'express'
import express from 'express'
import { authenticateToken } from '../middlewares/authenticate-token'
import { inboxGet } from '../controllers/messages-controller/inbox-control'
import {
  chatGet,
  messagePost,
} from '../controllers/messages-controller/message-control'
const router: Router = express.Router()

router.get('/', authenticateToken, inboxGet)
router.get('/:recepientUsername', authenticateToken, chatGet)
router.post('/:recepientUsername', authenticateToken, messagePost)
// router.delete('/', authenticateToken, messageDelete)
// router.put('/', authenticateToken, messagePut)

export default router
