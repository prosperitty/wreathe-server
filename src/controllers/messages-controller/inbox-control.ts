import type { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const inboxGet = async (req: Request, res: Response) => {
  try {
    const inbox = await prisma.message.findMany({
      where: {
        OR: [{ sender_ref: req.user.id }, { recepient_ref: req.user.id }],
      },
      // where: {
      //   sender_ref: req.user.id,
      // },
      orderBy: { message_timestamp: 'desc' }, // You can adjust the sorting based on your requirements
      distinct: ['sender_ref', 'recepient_ref'],
      include: {
        sender: {
          select: {
            user_uid: true,
            first_name: true,
            last_name: true,
            username: true,
          },
        },
        recepient: {
          select: {
            user_uid: true,
            first_name: true,
            last_name: true,
            username: true,
          },
        },
      },
    })

    const messagePairs = []
    for (let i = 0; i < inbox.length; i++) {
      const message = inbox[i]
      if (
        message.sender_ref === req.user.id ||
        message.recepient_ref === req.user.id
      ) {
        const matchingMessage = inbox.find(
          (msg) =>
            (msg.sender_ref === message.recepient_ref &&
              msg.recepient_ref === message.sender_ref) ||
            (msg.recepient_ref === message.sender_ref &&
              msg.sender_ref === message.recepient_ref),
        )
        if (matchingMessage) {
          messagePairs.push([message, matchingMessage])
          inbox.splice(inbox.indexOf(matchingMessage), 1)
        } else {
          messagePairs.push([message])
        }
      }
    }

    const inboxList = messagePairs.map((group) => {
      return group[0]
    })

    return res.json({
      success: true,
      message: 'SUCCESSFULLY FETCHED INBOX',
      inbox,
      inboxList,
    })
  } catch (err) {
    console.error(err)
    return res
      .status(403)
      .json({ success: false, message: 'Internal Server Error' })
  }
}
