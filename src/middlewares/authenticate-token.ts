import { NextFunction, Request, Response } from 'express'
import jwt = require('jsonwebtoken')
import 'dotenv/config'
import { RequestUser } from '../utils/types'

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    console.log('NO HEADERS SET')
    return res.status(401).json('No access token provided')
  }
  const accessToken = req.headers.authorization
  const bearerToken = accessToken.split(' ')[1]
  const secret: string = process.env.JWT_KEY as string

  try {
    const decoded = jwt.verify(bearerToken, secret) as RequestUser
    req.user = decoded
  } catch (err) {
    console.error('THERE WAS AN ERROR AUTHENTICATING THE TOKEN', err)
    return res.status(403).json({ error: 'expired access token' })
  }
  return next()
}
