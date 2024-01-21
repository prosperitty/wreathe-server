import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { NewUser } from '../utils/types'
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { body, validationResult } from 'express-validator'
const prisma = new PrismaClient()

export const registerGet = (req: Request, res: Response) => {
  res.send('register page')
}

export const registerPost = [
  body('firstName', 'First name is required')
    .trim()
    .isLength({ min: 1, max: 30 })
    .notEmpty()
    .withMessage('Can not be empty. Maximum characters is 30.'),
  body('lastName', 'Last name is required')
    .trim()
    .isLength({ min: 1, max: 30 })
    .notEmpty()
    .withMessage('Can not be empty. Maximum characters is 30.'),
  body('username', 'Username is required')
    .trim()
    .toLowerCase()
    .isLowercase()
    .isLength({ min: 1, max: 50 })
    .notEmpty()
    .withMessage('Can not be empty. Maximum characters is 50.'),
  body('password')
    .trim()
    .isLength({ min: 1, max: 100 })
    .notEmpty()
    .withMessage('Maximum characters is 100.'),
  body('email')
    .trim()
    .normalizeEmail({ all_lowercase: true })
    .isEmail()
    .isLength({ max: 100 }),

  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    const { firstName, lastName, username, password, email }: NewUser = req.body

    if (!errors.isEmpty()) {
      console.error('VALIDATION FAILURE:', errors.array())
      return res.json({
        firstName,
        lastName,
        username,
        password,
        email,
        errors: errors.array(),
      })
    }

    // Validate user input
    if (!(firstName && lastName && email && username && password)) {
      return res
        .status(400)
        .json({
          firstName,
          lastName,
          username,
          password,
          email,
          message: 'All input is required',
        })
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
      await prisma.wreathe_user.create({
        data: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          username: username,
          user_password: encryptedPassword,
        },
      })

      return res.json({ message: 'user successfully created' })
    } catch (err) {
      return res
        .status(403)
        .json({ err, message: 'There was an issue registering a new user' })
    }
  },
]

// const user: NewUser = {
//   firstName,
//   lastName,
//   email,
//   password: encryptedPassword,
// }
