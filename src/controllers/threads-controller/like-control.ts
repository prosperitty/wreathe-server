import type { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
// import cloudinary from '../../utils/cloudinary'
const prisma = new PrismaClient()

export const likeThread = async (req: Request, res: Response) => {
  const threadId = req.params.threadId
  const userId = req.user.id // Assuming you pass the user ID in the request body

  try {
    // Check if the thread exists
    const thread = await prisma.thread.findUnique({
      where: { thread_uid: threadId },
    })
    if (!thread) {
      return res.status(404).json({ error: 'Post not found' })
    }

    // Check if the user has already liked the thread
    const existingLike = await prisma.likes.findFirst({
      where: { thread_uid: threadId, user_uid: userId },
    })

    if (existingLike) {
      console.error('User has already liked the thread')
      return res
        .status(400)
        .json({ error: 'User has already liked the thread' })
    }

    // Create a new like
    const newLike = await prisma.likes.create({
      data: {
        thread_uid: threadId,
        user_uid: userId,
      },
    })

    // Update the thread's likes
    const updatedPost = await prisma.thread.update({
      where: { thread_uid: threadId },
      data: {
        likes: {
          connect: {
            user_uid_thread_uid: {
              user_uid: newLike.user_uid,
              thread_uid: newLike.thread_uid,
            },
          },
        },
      },
      include: {
        likes: true, // Include the likes in the response
      },
    })

    console.log(updatedPost)
    res.status(200).json(updatedPost)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const unlikeThread = async (req: Request, res: Response) => {
  const threadId = req.params.threadId
  const userId = req.user.id // Assuming you pass the user ID in the request body

  try {
    // Check if the thread exists
    const thread = await prisma.thread.findUnique({
      where: { thread_uid: threadId },
    })
    if (!thread) {
      return res.status(404).json({ error: 'Post not found' })
    }

    // Check if the user has liked the thread
    const existingLike = await prisma.likes.findFirst({
      where: { thread_uid: threadId, user_uid: userId },
    })

    if (!existingLike) {
      return res.status(400).json({ error: 'User has not liked the thread' })
    }

    // Delete the like
    await prisma.likes.delete({
      where: {
        user_uid_thread_uid: {
          thread_uid: existingLike.thread_uid,
          user_uid: existingLike.user_uid,
        },
      },
    })

    const updatedPost = await prisma.thread.findUnique({
      where: { thread_uid: threadId },
      include: {
        likes: true, // Include the likes in the response
      },
    })

    console.log(updatedPost)
    res.status(200).json(updatedPost)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const likeComment = async (req: Request, res: Response) => {
  const commentId = req.params.commentId
  const userId = req.user.id // Assuming you pass the user ID in the request body

  try {
    // Check if the comment exists
    const comment = await prisma.comment.findUnique({
      where: { comment_uid: commentId },
    })
    if (!comment) {
      return res.status(404).json({ error: 'Post not found' })
    }

    // Check if the user has already liked the comment
    const existingLike = await prisma.comment_likes.findFirst({
      where: { comment_uid: commentId, user_uid: userId },
    })

    if (existingLike) {
      console.error('User has already liked the comment')
      return res
        .status(400)
        .json({ error: 'User has already liked the comment' })
    }

    // Create a new like
    const newLike = await prisma.comment_likes.create({
      data: {
        comment_uid: commentId,
        user_uid: userId,
      },
    })

    // Update the comment's comment_likes
    const updatedPost = await prisma.comment.update({
      where: { comment_uid: commentId },
      data: {
        comment_likes: {
          connect: {
            user_uid_comment_uid: {
              user_uid: newLike.user_uid,
              comment_uid: newLike.comment_uid,
            },
          },
        },
      },
      include: {
        comment_likes: true, // Include the comment_likes in the response
      },
    })

    console.log(updatedPost)
    res.status(200).json(updatedPost)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const unlikeComment = async (req: Request, res: Response) => {
  const commentId = req.params.commentId
  const userId = req.user.id // Assuming you pass the user ID in the request body

  try {
    // Check if the comment exists
    const comment = await prisma.comment.findUnique({
      where: { comment_uid: commentId },
    })
    if (!comment) {
      return res.status(404).json({ error: 'Post not found' })
    }

    // Check if the user has liked the comment
    const existingLike = await prisma.comment_likes.findFirst({
      where: { comment_uid: commentId, user_uid: userId },
    })

    if (!existingLike) {
      return res.status(400).json({ error: 'User has not liked the comment' })
    }

    // Delete the like
    await prisma.comment_likes.delete({
      where: {
        user_uid_comment_uid: {
          comment_uid: existingLike.comment_uid,
          user_uid: existingLike.user_uid,
        },
      },
    })

    const updatedPost = await prisma.comment.findUnique({
      where: { comment_uid: commentId },
      include: {
        comment_likes: true, // Include the comment_likes in the response
      },
    })

    console.log(updatedPost)
    res.status(200).json(updatedPost)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
