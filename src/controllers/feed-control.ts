import type { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/* GET users listing. */
export const feedGet = async (req: Request, res: Response) => {
  try {
    const user = req.user
    const followingUsers = await prisma.follower.findMany({
      where: {
        followerId: user.id,
      },
      select: {
        followingId: true,
      },
    })
    const threads = await prisma.thread.findMany({
      where: {
        ispublished: true,
        OR: [
          {
            author_ref: {
              in: followingUsers.map(
                (followedUser) => followedUser.followingId,
              ),
            },
          },
          {
            author_ref: user.id,
          },
        ],
      },
      orderBy: {
        thread_timestamp: 'desc',
      },
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
    return res.json({
      success: true,
      message: 'SUCCESSFULLY FETCHED FEED',
      threads,
    })
  } catch (err) {
    console.error(err)
    res
      .status(403)
      .json({
        err,
        success: false,
        message: 'there was an issue fetching posts',
      })
  }
}
