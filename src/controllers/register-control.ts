import type { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { NewUser } from '../utils/types'
import 'dotenv/config'

export const registerGet = (req: Request, res: Response) => {
  res.send('register page')
}

export const registerPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { firstName, lastName, email, password }: NewUser = req.body

  // Validate user input
  if (!(firstName && lastName && email && password)) {
    res.status(400).send('All input is required')
  }

  try {
    // check if user already exist
    // Validate if user exist in our database
    // if (found_username) {
    //   // username exists, redirect to signup page.
    //   res.status(409).json({
    //     message: 'username is taken. try another username',
    //     isValid: false,
    // })
    const encryptedPassword = await bcrypt.hash(password, 10)

    //create new user and store in database
    const user: NewUser = {
      firstName,
      lastName,
      email,
      password: encryptedPassword,
    }

    return res.json({ user, message: 'user successfully created' })
  } catch (err) {
    return next(err)
  }
}
