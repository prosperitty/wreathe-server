import { Request, Response } from 'express'
import jwt = require('jsonwebtoken')
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const logoutPost = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshtoken
    const secret: string = process.env.JWT_KEY as string
    const decoded = jwt.verify(refreshToken, secret) as { id: string }
    const userId = decoded.id
    // Logic here for also remove refreshtoken from db
    await prisma.wreathe_user.update({
      where: { user_uid: userId },
      data: { refresh_token: null },
    })
    res.clearCookie('refreshToken', { path: '/refresh_token' })

    return res.json({
      message: 'Logged out',
    })
  } catch (err) {
    return res.status(403).json(err)
  }
}
