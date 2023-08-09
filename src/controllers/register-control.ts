import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { NewUser } from '../utils/types'
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const registerGet = (req: Request, res: Response) => {
  res.send('register page')
}

export const registerPost = async (req: Request, res: Response) => {
  const { firstName, lastName, email, username, password }: NewUser = req.body

  // Validate user input
  if (!(firstName && lastName && email && username && password)) {
    res.status(400).send('All input is required')
  }

  try {
    // Validate if user exist in our databaseS
    const found_username = await prisma.wreathe_user.findUnique({
      where: { username },
      select: { username: true },
    })
    const found_email = await prisma.wreathe_user.findUnique({
      where: { email },
      select: { email: true },
    })
    if (found_username) {
      return res.status(409).json({
        message: 'username is taken. try another username',
      })
    } else if (found_email) {
      return res.status(409).json({
        message: 'email is taken. try another email',
      })
    }

    //create new user and store in database
    const encryptedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.wreathe_user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        username: username,
        user_password: encryptedPassword,
      },
    })

    return res.json({ user, message: 'user successfully created' })
  } catch (err) {
    return res.status(403).json(err)
  }
}

// const user: NewUser = {
//   firstName,
//   lastName,
//   email,
//   password: encryptedPassword,
// }
