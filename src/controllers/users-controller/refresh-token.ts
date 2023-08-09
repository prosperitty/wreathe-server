import type { Request, Response } from 'express'
import jwt = require('jsonwebtoken')
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const refreshTokenPost = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshtoken

  // If we don't have a token in our request
  if (!refreshToken) {
    return res.status(401).json({ error: 'no refresh token provided!' })
  }

  try {
    // We have a token, let's verify it!
    const secret: string = process.env.JWT_KEY as string
    const decoded = jwt.verify(refreshToken, secret) as { id: string }
    const userId = decoded.id

    // token is valid, check if user exist
    const user = await prisma.wreathe_user.findUnique({
      where: { user_uid: userId },
    })
    if (!user) {
      return res.status(401).json({ error: 'User does not exist' })
    }

    // user exist, check if refreshtoken exist on user
    if (user.refresh_token !== refreshToken) {
      return res
        .status(401)
        .json({ error: 'The user does not have a refresh token!' })
    }

    // token exist, create new Refresh- and accesstoken
    const payload = { id: user.user_uid }
    const newAccessToken = jwt.sign(payload, secret, { expiresIn: '2m' })
    const newRefreshToken = jwt.sign(payload, secret, { expiresIn: '30m' })

    // update refreshtoken on user in db
    // Could have different versions instead!
    await prisma.wreathe_user.update({
      where: { user_uid: user.user_uid },
      data: { refresh_token: newRefreshToken },
    })

    // All good to go, send new refreshtoken and accesstoken
    res.cookie('refreshToken', newRefreshToken, {
      // httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    })

    return res.json({ newAccessToken })
  } catch (err) {
    return res.status(403).json(err)
  }
}

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
