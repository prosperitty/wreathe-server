import type { NextFunction, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/* GET users listing. */
export const usersGet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user
    console.log(user, '\n req user')
    if (!user) {
      return res.status(401).json('protected route')
    }
  } catch (err) {
    return next(err)
  }
  return res.json({ message: 'protected route accessed successfully' })
}
