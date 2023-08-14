import type { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/* GET users listing. */
export const usersGet = async (req: Request, res: Response) => {
  const allUsers = await prisma.wreathe_user.findMany()
  console.log(allUsers)
  res.json(allUsers)
}
