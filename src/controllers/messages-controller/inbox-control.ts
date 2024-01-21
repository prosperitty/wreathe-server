import type { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const inboxGet = async (req: Request, res: Response) => {
  try {
    const inbox = await prisma.message.findMany({
      where: {
        OR: [{ sender_ref: req.user.id }, { recepient_ref: req.user.id }],
      },
      orderBy: { message_timestamp: 'asc' }, // You can adjust the sorting based on your requirements
      distinct: ['sender_ref', 'recepient_ref'],
      // select: {
      //   sender: true,
      //   recepient: true,
      // },
    })

    // Get user information for each participant in the chats
    const participants = await Promise.all(
      inbox.map(async chat => {
        const otherUserId =
          chat.sender_ref === req.user.id ? chat.recepient_ref : chat.sender_ref
        const user = await prisma.wreathe_user.findUnique({
          where: { user_uid: otherUserId },
        })
        return user
      }),
    )

    // Combine participants and directChats to create a list of one-to-one chats
    const oneToOneChats = participants.map((participant, index) => ({
      participant,
      lastMessage: inbox[index], // Assuming the messages are ordered by creation date
    }))

    return res.json({
      success: true,
      message: 'SUCCESSFULLY FETCHED INBOX',
      inbox,
      oneToOneChats,
    })
  } catch (err) {
    console.error(err)
    return res
      .status(403)
      .json({ success: false, message: 'Internal Server Error' })
  }
}

export const inboxSearch = async (req: Request, res: Response) => {
  try {
    console.log('inbox search')
    return res.json({
      success: true,
      message: 'SUCCESSFULLY FETCHED INBOX',
    })
  } catch (err) {
    console.error(err)
    return res
      .status(403)
      .json({ success: false, message: 'Internal Server Error' })
  }
}
