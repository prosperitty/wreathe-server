import type { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'
// import cloudinary from '../../utils/cloudinary'
const prisma = new PrismaClient()

export const threadsGet = async (req: Request, res: Response) => {
  try {
    const threads = await prisma.thread.findMany({
      where: { ispublished: true },
      orderBy: { thread_timestamp: 'desc' },
    })
    return res.json({ threads })
  } catch (err) {
    res.status(403).json({ err, message: 'there was an issue fetching posts' })
  }
}

export const threadsPost = [
  body('content', 'Content is required').trim().isLength({ min: 1 }),
  body('isPublished', 'boolean value needed').isBoolean(),
  body('userUid', 'missing a user id reference').isUUID(),

  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    const threadData = {
      content: req.body.content,
      ispublished: req.body.isPublished,
      //change the method to grab useruid
      author_ref: req.body.userUid,
    }
    if (!errors.isEmpty()) {
      return res.json({ threadData, errors: errors.array() })
    }
    try {
      const thread = await prisma.thread.create({
        data: threadData,
      })
      const threadURL = `/threads/${thread.thread_uid}`
      return res.json({ thread, threadURL })
    } catch (err) {
      return res
        .status(403)
        .json({ err, message: 'there was an issue creating a new post' })
    }
  },
]

export const threadsPut = [
  body('content', 'Content is required').trim().isLength({ min: 1 }),
  body('isPublished', 'boolean value needed').isBoolean(),

  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    const threadData = {
      thread_uid: req.params.threadid,
      content: req.body.content,
      ispublished: req.body.isPublished,
      //change the method to grab useruid
      author_ref: req.body.userUid,
    }
    if (!errors.isEmpty()) {
      return res.json({ threadData, errors: errors.array() })
    }
    try {
      const thread = await prisma.thread.update({
        where: { thread_uid: req.params.threadid },
        data: threadData,
      })
      const threadURL = `/threads/${thread.thread_uid}`
      return res.json({ thread, threadURL })
    } catch (err) {
      return res
        .status(403)
        .json({ err, message: 'there was an issue creating a new post' })
    }
  },
]

export const threadsDelete = async (req: Request, res: Response) => {
  try {
    // const thread = await prisma.thread.findUniqueOrThrow({
    //   where: { thread_uid: req.params.threadid },
    // })
    try {
      // const deletedImage = await cloudinary.uploader.destroy(
      //   thread.image.public_url,
      //   { invalidate: true },
      // )
      const deletedThread = await prisma.thread.delete({
        where: { thread_uid: req.params.threadid },
      })
      // console.log(deletedImage, '\n cloudinary image deleted')
      console.log(deletedThread, '\n Thread has been deleted')

      return res.json({ deletedThread })
    } catch (err) {
      res.status(403).json({ err, message: 'there was an deleting the post.' })
    }
  } catch (err) {
    res.status(403).json({ err, message: 'there was an issue fetching posts' })
  }
}
