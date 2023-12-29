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
    if (!user) {
      console.error('YOU MUST BE SIGNED IN TO ACCESS THIS ROUTE!')
      const userData = await prisma.wreathe_user.findUnique({
        where: { user_uid: req.params.userId },
        select: {
          user_uid: true,
          first_name: true,
          last_name: true,
          email: true,
          username: true,
        },
      })
      const userThreads = await prisma.thread.findMany({
        where: { author_ref: req.params.userId },
        include: {
          wreathe_user: {
            select: {
              user_uid: true,
              first_name: true,
              last_name: true,
              username: true,
            },
          },
        },
      })
      return res
        .status(401)
        .json({
          message: 'YOU MUST BE SIGNED IN TO ACCESS THIS ROUTE!',
          userData,
          userThreads,
        })
    }
  } catch (err) {
    console.error('THERE WAS AN ISSUE RENDERING THIS PAGE', err)
    return res.json({ err, message: 'THERE WAS AN ISSUE RENDERING THIS PAGE!' })
  }
  const userData = await prisma.wreathe_user.findUnique({
    where: { user_uid: req.params.userId },
  })
  const userThreads = await prisma.thread.findMany({
    where: { author_ref: req.params.userId },
    include: {
      wreathe_user: {
        select: {
          user_uid: true,
          first_name: true,
          last_name: true,
          username: true,
        },
      },
    },
  })
  return res.json({
    message: 'PROTECTED ROUTE ACCESSED SUCCESSFULLY',
    userData,
    userThreads,
  })
}

export const usersThreadPage = async (req: Request, res: Response) => {
  try {
    const thread = await prisma.thread.findUnique({
      where: { thread_uid: req.params.threadId, author_ref: req.params.userId },
      include: {
        wreathe_user: {
          select: {
            user_uid: true,
            first_name: true,
            last_name: true,
            username: true,
          },
        },
        // wreathe_user: true,
        comment: true,
      },
    })
    console.log(thread, '\n thread ==========================')
    return res.json({ thread })
  } catch (err) {
    console.error('THREAD NOT FOUND OR ISSUE FINDING THREAD')
    return res.json({
      err,
      message: 'THREAD NOT FOUND OR ISSUE FINDING THREAD',
    })
  }
}
