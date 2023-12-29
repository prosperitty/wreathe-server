import type { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const messagesGet = (req: Request, res: Response) => {
  console.log(req.params)
}
