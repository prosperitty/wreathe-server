import type { Request, Response } from 'express'
import jwt = require('jsonwebtoken')
import {
  setAccessToken,
  setRefreshToken,
  setUserData,
} from '../utils/cookie-setter'
import { PrismaClient } from '@prisma/client'
import { RequestUser } from '../utils/types'
const prisma = new PrismaClient()

const secretKey: string = process.env.JWT_KEY as string
// const encodedKey = new TextEncoder().encode(secret);

export const refreshTokenPost = async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken
  const refreshToken = req.cookies.refreshToken
  const userData = req.cookies.userData

  // If we don't have a token in our request
  if (!refreshToken) {
    res.clearCookie('userData', { path: '/' })
    console.error('NO REFRESH TOKEN PROVIDED! SIGN IN OR REGISTER NEEDED:')
    return res
      .status(401)
      .json({ error: 'no refresh token provided! Sign in.' })
  }
  if (accessToken) {
    console.log('ACCESS TOKEN STILL EXISTS!')
    return res.json({ accessToken, userData })
  }

  try {
    // We have a token, let's verify it!
    const decoded = jwt.verify(refreshToken, secretKey) as RequestUser
    const userId = decoded.id

    // token is valid, check if user exist
    const user = await prisma.wreathe_user.findUnique({
      where: { user_uid: userId },
    })
    if (!user) {
      console.error('USER DOES NOT EXIST! ERROR FINDING USER IN DB')
      return res.status(401).json({ error: 'User does not exist' })
    }

    // user exist, check if refreshtoken exist on user
    if (user.refresh_token !== refreshToken) {
      console.log(user.refresh_token, '\n')
      console.log(refreshToken, '\n')
      console.error(
        'NO REFRESH TOKEN FOUND ON USER! OR REFRESH TOKEN DOES NOT MATCH BROWSER REFRESH TOKEN WITH USERS REFRESH TOKEN!',
      )
      return res
        .status(401)
        .json({ error: 'The user does not have a refresh token!' })
    }

    // token exist, create new Refresh- and accesstoken
    const payload = { id: user.user_uid, username: user.username }
    const newAccessToken = jwt.sign(payload, secretKey, { expiresIn: '1h' })
    const newRefreshToken = jwt.sign(payload, secretKey, { expiresIn: '1d' })

    // update refreshtoken on user in db
    // Could have different versions instead!
    await prisma.wreathe_user.update({
      where: { user_uid: user.user_uid },
      data: { refresh_token: newRefreshToken },
    })

    const userData = {
      user_uid: user.user_uid,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      username: user.username,
    }

    setAccessToken(res, 'accessToken', newAccessToken, 60 * 60 * 1000)
    setRefreshToken(res, 'refreshToken', newRefreshToken, 24 * 60 * 60 * 1000)
    setUserData(res, 'userData', JSON.stringify(userData), 24 * 60 * 60 * 1000)

    return res.json({ accessToken: newAccessToken, userData })
  } catch (err) {
    console.error('THERE WAS AN ISSUE REFRESHING THE TOKEN\n', err)
    return res.status(403).json(err)
  }
}

// res.cookie('accessToken', newAccessToken, {
//   // httpOnly: true,
//   secure: false,
//   sameSite: 'none',
//   maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
//   path: '/users/refresh-token',
// })
// // All good to go, send new refreshtoken and accesstoken
// res.cookie('refreshToken', newRefreshToken, {
//   // httpOnly: true,
//   secure: false,
//   sameSite: 'none',
//   maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
//   path: '/users/refresh-token',
// })

// const bearerToken = req.headers.authorization!
// const refreshToken = bearerToken.split(' ')[1]

// const user = fakeDB.find(user => user.id === payload.userId);

// jwt.verify(refreshToken, secret, {}, (err, decoded: any) => {
//   if (err || !decoded) {
//     return res
//       .status(403)
//       .json({ error: 'Failed to authenticate refresh token' })
//   } else {
//     userId = decoded
//     console.log(
//       decoded,
//       'decoded user should be set to user. just set the user variable declaration to the jwt verify function and return decoded from the function',
//     )
//   }
// })

//FAKE USER ONLY
// const user: User = {
//   id: userId,
//   firstName: 'first',
//   lastName: 'last',
//   email: 'email@email.com',
//   password: 'password',
//   refreshToken: null!,
// }

// console.log(user.refresh_token, '\n=============')
// console.log(refreshToken, '\n=================')

// user.refreshToken = newRefreshToken
