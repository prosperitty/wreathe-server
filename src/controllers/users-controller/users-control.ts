import type { NextFunction, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/* GET users listing. */
export const usersGet = async (req: Request, res: Response) => {
  try {
    const user = req.user
    if (!user) {
      console.error('YOU MUST BE SIGNED IN TO ACCESS THIS ROUTE!')
      const profileData = await prisma.wreathe_user.findUnique({
        where: { user_uid: req.params.userId },
        select: {
          user_uid: true,
          first_name: true,
          last_name: true,
          email: true,
          username: true,
          thread: true,
          comment: true,
          likes: true,
          comment_likes: true,
          followers: true,
          following: true,
        },
      })
      const profileThreads = await prisma.thread.findMany({
        where: { author_ref: req.params.userId },
        include: {
          comment: true,
          likes: true,
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
      const profileComments = await prisma.comment.findMany({
        where: { author_ref: req.params.userId, ispublished: true },
        include: {
          thread: {
            include: {
              wreathe_user: true,
            },
          },
          comment_likes: true,
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
      const profileLikes = await prisma.likes.findMany({
        where: { user_uid: req.params.userId },
        include: {
          thread: {
            include: {
              wreathe_user: true,
              comment: true,
              likes: true,
            },
          },
        },
      })
      const profileCommentLikes = await prisma.comment_likes.findMany({
        where: { user_uid: req.params.userId },
        include: {
          comment: {
            include: {
              wreathe_user: true,
              thread: {
                include: {
                  wreathe_user: {
                    select: {
                      username: true,
                    },
                  },
                },
              },
              comment_likes: true,
            },
          },
        },
      })
      const allLikes = [...profileLikes, ...profileComments].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      return res.status(401).json({
        message: 'YOU MUST BE SIGNED IN TO ACCESS THIS ROUTE!',
        profileData,
        profileThreads,
        profileComments,
        profileLikes,
        profileCommentLikes,
        allLikes,
      })
    } else {
      const profileData = await prisma.wreathe_user.findUnique({
        where: { user_uid: req.params.userId.toString() },
        include: {
          thread: true,
          comment: true,
          likes: true,
          comment_likes: true,
          followers: true,
          following: true,
        },
      })
      const profileThreads = await prisma.thread.findMany({
        where: { author_ref: req.params.userId },
        include: {
          comment: true,
          likes: true,
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
      const profileComments = await prisma.comment.findMany({
        where: { author_ref: req.params.userId, ispublished: true },
        include: {
          thread: {
            include: {
              wreathe_user: true,
            },
          },
          comment_likes: true,
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
      const profileLikes = await prisma.likes.findMany({
        where: { user_uid: req.params.userId },
        include: {
          thread: {
            include: {
              wreathe_user: true,
              comment: true,
              likes: true,
            },
          },
        },
      })
      const profileCommentLikes = await prisma.comment_likes.findMany({
        where: { user_uid: req.params.userId },
        include: {
          comment: {
            include: {
              wreathe_user: true,
              thread: {
                include: {
                  wreathe_user: {
                    select: {
                      username: true,
                    },
                  },
                },
              },
              comment_likes: true,
            },
          },
        },
      })
      const allLikes = [...profileLikes, ...profileCommentLikes].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      return res.json({
        message: 'PROTECTED ROUTE ACCESSED SUCCESSFULLY',
        profileData,
        profileThreads,
        profileComments,
        profileLikes,
        profileCommentLikes,
        allLikes,
      })
    }
  } catch (err) {
    console.error('THERE WAS AN ISSUE RENDERING THIS PAGE', err)
    return res.json({ err, message: 'THERE WAS AN ISSUE RENDERING THIS PAGE!' })
  }
}

export const usersThreadPage = async (req: Request, res: Response) => {
  const user = req.user
  let isLike = false
  try {
    const thread = await prisma.thread.findUnique({
      where: { thread_uid: req.params.threadId, author_ref: req.params.userId },
      include: {
        comment: {
          include: {
            thread: true,
            wreathe_user: true,
            comment_likes: true,
          },
        },
        likes: true,
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

    console.log(
      thread?.wreathe_user?.username,
      '==========================username',
    )

    if (user) {
      const userLike = await prisma.likes.findUnique({
        where: {
          user_uid_thread_uid: {
            user_uid: req.user.id,
            thread_uid: req.params.threadId,
          },
        },
      })
      isLike = Boolean(userLike)
    }
    return res.json({ thread, isLike })
  } catch (err) {
    console.error('THREAD NOT FOUND OR ISSUE FINDING THREAD')
    return res.json({
      err,
      message: 'THREAD NOT FOUND OR ISSUE FINDING THREAD',
    })
  }
}
