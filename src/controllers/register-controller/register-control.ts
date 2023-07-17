import type { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { User } from './types'
// import type jwt from 'jsonwebtoken'
import jwt = require('jsonwebtoken')
import 'dotenv/config'

export const registerGet = (req: Request, res: Response) => {
  res.send('register page')
}

export const registerPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firstName, lastName, email, password }: User = req.body

    // Validate user input
    if (!(firstName && lastName && email && password)) {
      res.status(400).send('All input is required')
    }

    // check if user already exist
    // Validate if user exist in our database
    // if (found_username) {
    //   // username exists, redirect to signup page.
    //   res.status(409).json({
    //     message: 'username is taken. try another username',
    //     isValid: false,
    // })

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      const user: User = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        token: undefined!,
      }
      // Save the user information in the database or any other storage mechanism
      // Replace this code with your own logic
      // const user = {
      //   id: 1,
      //   username,
      //   password: hashedPassword
      // };
      if (err) {
        return next(err)
      }
      return res.json(user)
    })
  } catch (err) {
    return next(err)
  }

  // if (err) {
  // } else {
  //   return res
  //     .status(200)
  //     .json({ message: 'password was encrypted', user, hashedPassword })
  // }
}
