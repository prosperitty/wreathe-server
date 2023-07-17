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
  const { email, password } = req.body

  try {
    // Authenticate the user by fetching user from DB
    const user = {
      id: 123,
      email: 'email@email.com',
      password: 'password',
    }
    if (!user) {
      return res.status(401).json({ error: 'USER DOES NOT EXIST!' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'PASSWORD NOT CORRECT' })
    }

    const secret: string = process.env.JWT_KEY as string
    const payload: { id: number; email: string } = { id: user.id, email }
    const accessToken = jwt.sign(payload, secret, { expiresIn: '2m' })
    const refreshToken = jwt.sign(payload, secret, { expiresIn: '30m' })

    //add refreshToken to user and store in DB?

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
