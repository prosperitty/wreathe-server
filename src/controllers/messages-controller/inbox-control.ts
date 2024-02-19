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

    // Get user information for each participant in the chats
    // const participants = await Promise.all(
    //   inbox.map(async chat => {
    //     const otherUserId =
    //       chat.sender_ref === req.user.id ? chat.recepient_ref : chat.sender_ref
    //     const user = await prisma.wreathe_user.findUnique({
    //       where: { user_uid: otherUserId },
    //     })
    //     return user
    //   }),
    // )

    // console.log(participants.length)

    // Combine participants and directChats to create a list of one-to-one chats
    // const oneToOneChats = participants.map((participant, index) => ({
    //   participant,
    //   lastMessage: inbox[index], // Assuming the messages are ordered by creation date
    // }))

    const messagePairs = []

    // Iterate over messages
    for (let i = 0; i < inbox.length; i++) {
      const message = inbox[i]

      // Check if the message is between the specified users
      if (
        message.sender_ref === req.user.id ||
        message.recepient_ref === req.user.id
      ) {
        // Find the matching message from the other user
        const matchingMessage = inbox.find(
          msg =>
            (msg.sender_ref === message.recepient_ref &&
              msg.recepient_ref === message.sender_ref) ||
            (msg.recepient_ref === message.sender_ref &&
              msg.sender_ref === message.recepient_ref),
        )

        if (matchingMessage) {
          // Group the messages together
          messagePairs.push([message, matchingMessage])

          // Remove the matching message from the array to avoid duplicate pairs
          inbox.splice(inbox.indexOf(matchingMessage), 1)
        } else {
          messagePairs.push([message])
        }
      }
    }

    const inboxList = messagePairs.map(group => {
      return group[0]
    })

    // const allLikes = messagePairs.forEach(group => {
    //   group.sort(
    //     (a, b) =>
    //       new Date(b.message_timestamp).getTime() -
    //       new Date(a.message_timestamp).getTime(),
    //   )
    // })
    // console.log(messagePairs)

    return res.json({
      success: true,
      message: 'SUCCESSFULLY FETCHED INBOX',
      inbox,
      inboxList,
      // oneToOneChats,
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
