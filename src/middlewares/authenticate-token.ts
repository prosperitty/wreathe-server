import { NextFunction, Request, Response } from 'express'
import jwt = require('jsonwebtoken')
import 'dotenv/config'

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'No access token provided' })
  }
  const accessToken = req.headers.authorization
  const bearerToken = accessToken.split(' ')[1]
  const secret: string = process.env.JWT_KEY as string

  try {
    const decoded = jwt.verify(bearerToken, secret)
    req.user = decoded
  } catch (err) {
    return res.status(403).json({ error: 'expired access token' })
  }
  return next()
}
