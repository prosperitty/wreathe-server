import type { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const followPost = async (req: Request, res: Response) => {
  try {
    const user = req.user

    // Check if followerId and followingId are different
    if (user.id === req.params.userId) {
      console.log('Cannot follow yourself')
      return res
        .status(400)
        .json({ success: false, message: 'Cannot follow yourself' })
    }
    // Use Prisma to create a follower relationship
    const follower = await prisma.follower.create({
      data: {
        followerId: user.id,
        followingId: req.params.userId,
      },
    })

    res.json({ success: true, message: 'User followed successfully', follower })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const unFollowPost = async (req: Request, res: Response) => {
  try {
    const user = req.user

    // Check if followerId and followingId are different
    if (user.id === req.params.userId) {
      return res
        .status(400)
        .json({ success: false, message: 'Cannot unfollow yourself' })
    }

    // Use Prisma to create a follower relationship
    const unfollower = await prisma.follower.delete({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: req.params.userId,
        },
      },
    })

    res.json({
      success: true,
      message: 'User unfollowed successfully',
      unfollower,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const followingGet = async (req: Request, res: Response) => {
  try {
    const followingUsers = await prisma.follower.findMany({
      where: {
        followerId: req.params.userId,
      },
      select: {
        following: true,
      },
    })
    const following = followingUsers.map(item => item.following)
    return res.json({
      success: true,
      message: 'Following Users fetched successfully===',
      following,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const followersGet = async (req: Request, res: Response) => {
  try {
    const followerUsers = await prisma.follower.findMany({
      where: {
        followingId: req.params.userId,
      },
      select: {
        follower: true,
      },
    })
    const followers = followerUsers.map(item => item.follower)
    return res.json({
      success: true,
      message: 'Follower Users fetched successfully',
      followers,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
