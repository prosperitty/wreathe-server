import { Request, Response } from 'express'

export const logoutPost = (req: Request, res: Response) => {
  res.clearCookie('refreshtoken', { path: '/refresh_token' })
  // Logic here for also remove refreshtoken from db
  return res.json({
    message: 'Logged out',
  })
}
