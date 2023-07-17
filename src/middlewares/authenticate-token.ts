import { NextFunction, Request, Response } from 'express'
import jwt = require('jsonwebtoken')
import 'dotenv/config'

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'No access token provided' })
    }
    const accessToken = req.headers.authorization
    const bearer = accessToken.split(' ')
    const bearerToken = bearer[1]
    const secret: string = process.env.JWT_KEY as string

    jwt.verify(bearerToken, secret, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid access token' })
      }
      console.log(user, 'authenticate middleware')
      return next()
    })
  } catch (err) {
    return next(err)
  }
}
