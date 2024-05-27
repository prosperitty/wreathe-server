import { Request, Response } from 'express'
import jwt = require('jsonwebtoken')
import { PrismaClient } from '@prisma/client'
import { RequestUser } from '../utils/types'
const prisma = new PrismaClient()

export const logoutPost = async (req: Request, res: Response) => {
  try {
    // THIS IS TEST CODE FOR SERVER ACTIONS ON THE CLIENT SIDE IN NEXT JS
    // const refreshToken = req.headers.authorization.split(' ')[1]
    const refreshToken = req.cookies.refreshToken
    const secret: string = process.env.JWT_KEY as string
    const decoded = jwt.verify(refreshToken, secret) as RequestUser
    const userId = decoded.id
    // Logic here for also remove refreshtoken from db
    await prisma.wreathe_user.update({
      where: { user_uid: userId },
      data: { refresh_token: null },
    })

    //bug, can not logout without using /logout path because cookie can only be retrieved from this path
    res.clearCookie('refreshToken', { path: '/logout' })
    res.clearCookie('accessToken', { path: '/' })
    res.clearCookie('userData', { path: '/' })

    return res.json({
      message: 'Log Out Successful',
    })
  } catch (err) {
    console.error('THERE WAS AN ISSUE LOGGING OUT', err)
    return res
      .status(403)
      .json({ err, message: 'There was an issue logging out' })
  }
}
