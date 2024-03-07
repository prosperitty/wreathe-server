import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { body, validationResult } from 'express-validator'
const prisma = new PrismaClient()

export const settingsGet = async (req: Request, res: Response) => {
  try {
    const user = await prisma.wreathe_user.findUniqueOrThrow({
      //change the method to grab userid
      where: { user_uid: req.user.id },
    })
    return res.json({
      success: true,
      message: 'Signed In User Fetched Successfully',
      user,
    })
  } catch (err) {
    console.error(err)
    return res
      .status(403)
      .json({ success: false, message: 'Internal Server Error' })
  }
}

export const settingsPost = [
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
    .optional({ values: 'falsy' || 'null' || 'undefined' })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Maximum characters is 100.'),
  body('email')
    .trim()
    .normalizeEmail({ all_lowercase: true })
    .isEmail()
    .isLength({ max: 100 }),
  body('bio').optional().trim().isLength({ max: 150 }),

  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      const updatedUserData = {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        user_password: req.body.password,
        bio: req.body.bio,
      }
      if (!errors.isEmpty()) {
        console.error('VALIDATION FAILURE:', errors.array())
        return res.json({ updatedUserData, errors: errors.array() })
      }

      const existingUser = await prisma.wreathe_user.findUnique({
        where: { user_uid: req.user.id },
      })
      if (!existingUser) {
        console.error('USER NOT FOUND')
        return res.status(404).json({ error: 'User not found' })
      }
      const existingUsername = await prisma.wreathe_user.findUnique({
        where: { username: req.body.username },
      })
      if (!existingUsername) {
        console.error('USERNAME IS ALREADY TAKEN')
        return res.status(400).json({ error: 'Username is already taken' })
      }
      const existingEmail = await prisma.wreathe_user.findUnique({
        where: { email: req.body.email },
      })
      if (!existingEmail) {
        console.error('EMAIL IS ALREADY TAKEN')
        return res.status(400).json({ error: 'Email is already taken' })
      }

      if (req.body.password) {
        const newPassword = req.body.password
        const isMatch = await bcrypt.compare(
          newPassword,
          existingUser.user_password,
        )
        if (isMatch) {
          console.error('NEW PASSWORD MUST BE DIFFERENT FROM PREVIOUS PASSWORD')
          return res.status(400).json({
            error: 'New password must be different from the previous password',
          })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        updatedUserData.user_password = hashedPassword
      } else {
        updatedUserData.user_password = existingUser.user_password
      }

      const updatedUser = await prisma.wreathe_user.update({
        where: { user_uid: req.user.id },
        data: updatedUserData,
      })
      const userURL = `users/${updatedUser.user_uid}`
      console.log(updatedUser, 'updated user')
      return res.json({
        success: true,
        message: 'User settings updated successfully',
        updatedUser,
        userURL,
      })
    } catch (err) {
      console.error(err)
      return res
        .status(403)
        .json({ success: false, message: 'Internal Server Error' })
    }
  },
]
