import type { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

/* GET users listing. */
export const usersGet = async (req: Request, res: Response) => {
  const allUsers = await prisma.wreathe_user.findMany()
  console.log(allUsers)
  res.json(allUsers)
}

export const usersPost = async (req: Request, res: Response) => {
  const encryptedPassword = await bcrypt.hash('johndoe', 10)
  await prisma.wreathe_user.create({
    data: {
      first_name: 'john',
      last_name: 'doe',
      email: 'johndoe@gmail.com',
      username: 'johndoe',
      user_password: encryptedPassword,
      thread: {
        create: {
          content: 'hello world',
        },
      },
    },
  })

  const allUsers = await prisma.wreathe_user.findMany({
    include: {
      thread: true,
    },
  })

  console.log(allUsers)
  res.json(allUsers)
}

export const usersUpdate = async (req: Request, res: Response) => {
  const thread = await prisma.thread.update({
    where: { thread_uid: ' ' },
    data: { content: 'hello world updated' },
  })
  console.log(thread)
  res.json(thread)
}
