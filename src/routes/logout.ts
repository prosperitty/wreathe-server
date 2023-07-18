import express, { Router } from 'express'
const router: Router = express.Router()

router.post('/', (req, res) => {
  res.clearCookie('refreshtoken', { path: '/refresh_token' })
  // Logic here for also remove refreshtoken from db
  return res.json({
    message: 'Logged out',
  })
})

export default router
