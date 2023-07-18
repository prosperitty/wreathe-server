import type { Request, Response, Router } from 'express'
import express from 'express'
const router: Router = express.Router()

/* GET home page. */
router.get('/', function (req: Request, res: Response) {
  res.json({ message: 'homepage' })
})

export default router
