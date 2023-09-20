import { Request, Response } from 'express'
import jwt = require('jsonwebtoken')
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const logoutPost = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken
    const secret: string = process.env.JWT_KEY as string
    const decoded = jwt.verify(refreshToken, secret) as { id: string }
    const userId = decoded.id
    // Logic here for also remove refreshtoken from db
    await prisma.wreathe_user.update({
      where: { user_uid: userId },
      data: { refresh_token: null },
    })
    //bug, can not logout because cookie can only be retrieved from this path
    res.clearCookie('refreshToken', { path: '/refresh-token' })
    res.clearCookie('accessToken', { path: '/' })

    return res.json({
      message: 'Log Out Successful',
    })
  } catch (err) {
    console.log(err)
    return res
      .status(403)
      .json({ err, message: 'There was an issue logging out' })
  }
}
