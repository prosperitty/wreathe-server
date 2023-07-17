import type { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
// import { User } from '../../types'
import jwt = require('jsonwebtoken')
import 'dotenv/config'

export const loginGet = (req: Request, res: Response) => {
  res.cookie('cookie set', 'this')
  res.send('login page')
}

export const loginPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body
    // Authenticate the user by fetching user
    const user = {
      id: 123,
      email: 'email@email.com',
      password: 'password',
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'invalid credentials' })
    }

    const secret: string = process.env.JWT_KEY as string
    const payload: { id: number; email: string } = { id: user.id, email }
    // Generate an access token
    const accessToken = jwt.sign(payload, secret, { expiresIn: '2m' })
    // Generate a refresh token
    const refreshToken = jwt.sign(payload, secret, { expiresIn: '30m' })

    // Set refresh token as a secure HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      // httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    })

    // Send the access token in the response
    res.json({ accessToken, message: 'auth passed' })
  } catch (err) {
    return next(err)
  }
}
