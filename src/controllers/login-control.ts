import type { Request, Response } from 'express'
// eslint-disable-next-line import/default
import bcrypt from 'bcryptjs'
import jwt = require('jsonwebtoken')
import 'dotenv/config'
import { LoginCredentials } from '../utils/types'
// import {
//   setAccessToken,
//   setRefreshToken,
//   setUserData,
// } from '../utils/cookie-setter'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const loginGet = (req: Request, res: Response) => {
  res.send('login page')
}

const secretKey: string = process.env.JWT_KEY as string
// const encodedKey = new TextEncoder().encode(secret)

export const loginPost = async (req: Request, res: Response) => {
  try {
    const { username, password }: LoginCredentials = req.body
    if (!(username && password)) {
      console.error('MISSING CREDENTIALS!')
      return res.status(400).json({ errorMessage: 'MISSING CREDENTIALS' })
    }

    // Authenticate the user by fetching user from DB by username(username)
    const user = await prisma.wreathe_user.findUnique({
      where: {
        username,
      },
    })
    if (!user) {
      console.error('INVALID USERNAME OR PASSWORD')
      return res
        .status(401)
        .json({ errorMessage: 'INVALID USERNAME OR PASSWORD' })
    }
    const passwordMatch = await bcrypt.compare(password, user.user_password)
    if (!passwordMatch) {
      console.error('INVALID USERNAME OR PASSWORD')
      return res
        .status(401)
        .json({ errorMessage: 'INVALID USERNAME OR PASSWORD' })
    }

    //Refresh token
    const payload = { id: user.user_uid, username: user.username }
    const accessToken = jwt.sign(payload, secretKey, { expiresIn: '1h' })
    const refreshToken = jwt.sign(payload, secretKey, { expiresIn: '1d' })

    //add refreshToken to user and store in DB?
    await prisma.wreathe_user.update({
      where: { user_uid: user.user_uid },
      data: { refresh_token: refreshToken },
    })

    const userData = {
      user_uid: user.user_uid,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      username: user.username,
    }

    // setAccessToken(res, 'accessToken', accessToken, 60 * 60 * 1000)
    // setRefreshToken(res, 'refreshToken', refreshToken, 24 * 60 * 60 * 1000)
    // setUserData(res, 'userData', JSON.stringify(userData), 24 * 60 * 60 * 1000)

    // Send the access token in the response
    return res.json({
      success: true,
      message: 'Login Successful',
      accessToken,
      userData,
      refreshToken,
    })
  } catch (error) {
    console.error('THERE WAS IN ISSUE SIGNING IN', error)
    return res.status(403).json({
      error,
      success: false,
      message: 'Something went wrong, try again.',
      errorMessage: `THERE WAS AN ISSUE SIGNING IN: ${error}`,
    })
  }
}

//FAKE USER ONLY MAKE SURE TO DELETE
// const encryptedPassword = await bcrypt.hash('password', 10)
// const user: User = {
//   id: '123',
//   firstName: 'first',
//   lastName: 'last',
//   email: email,
//   password: encryptedPassword,
//   refreshToken: null!,
// }

// user.refreshToken = refreshToken
