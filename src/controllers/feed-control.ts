import type { NextFunction, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/* GET users listing. */
export const feedGet = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user
    if (!user) {
      console.error('YOU MUST BE SIGNED IN TO ACCESS YOUR FEED!')
      return res.status(401).json('YOU MUST BE SIGNED IN TO ACCESS YOUR FEED!')
    }
  } catch (err) {
    console.error('THERE WAS AN ISSUE RENDERING THIS PAGE', err)
    return res.json({ err, message: 'THERE WAS AN ISSUE RENDERING THIS PAGE!' })
  }
  return res.json({ message: 'PROTECTED ROUTE ACCESSED SUCCESSFULLY' })
}
