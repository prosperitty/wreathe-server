import express from 'express'
import { searchForUser } from '../controllers/search-controller/search-control'
const router = express.Router()

// router.get('/', registerGet)

router.post('/', searchForUser)

export default router
