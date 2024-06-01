import type { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { body, validationResult } from 'express-validator'
const prisma = new PrismaClient()

//IMPLEMENT THE INBOX PAGE AND MESSAGE PAGE ON FRONT END
//WILL USE USERNAME AS THE PARAMATER
//SEARCH THE USER BY USERNAME AND MAKE THE HEADER OF THE RECEPIENT
//WILL HAVE TO TRY AND SET  UP REALTIME MESSAGING WITH WEB SOCKETS

export const chatGet = async (req: Request, res: Response) => {
  try {
    const user = await prisma.wreathe_user.findUnique({
      where: { user_uid: req.user.id },
    })
    const recepient = await prisma.wreathe_user.findUnique({
      where: { username: req.params.recepientUsername },
    })

    if (!user || !recepient) {
      console.error('USERS NOT FOUND')
      return res.status(404).json({ error: 'Users not found' })
    }
    if (req.params.recepientUsername === req.user.username) {
      console.error('CAN NOT MESSAGE YOURSELF')
      return res.status(404).json({ error: 'CAN NOT CHAT WITH YOURSELF' })
    }

    const directMessages = await prisma.message.findMany({
      where: {
        OR: [
          { sender_ref: user.user_uid, recepient_ref: recepient.user_uid },
          { sender_ref: recepient.user_uid, recepient_ref: user.user_uid },
        ],
      },
      orderBy: { message_timestamp: 'asc' },
      include: {
        sender: true,
        recepient: true,
      },
    })

    return res.json({
      success: true,
      message: 'SUCCESSFULLY FETCHED MESSAGES',
      directMessages,
      recepient,
      userId: req.user.id,
    })
  } catch (error) {
    console.error('Error fetching direct messages:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const messageGet = async (req: Request, res: Response) => {
  try {
    const user = await prisma.message.findUniqueOrThrow({
      //change the method to grab userid
      where: {
        message_uid: req.params.messageId,
      },
    })
    return res.json({
      success: true,
      message: 'SUCCESSFULLY FETCHED THE MESSAGE',
      user,
    })
  } catch (err) {
    console.error(err)
    return res
      .status(403)
      .json({ success: false, message: 'Internal Server Error' })
  }
}
export const messagePost = [
  body('content', 'Content is required')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .notEmpty()
    .withMessage('Content can not be an empty space'),

  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      const messageData = {
        content: req.body.content,
        sender_ref: req.user.id,
        recepient_ref: req.params.recepientUsername,
      }
      if (!errors.isEmpty()) {
        console.error('VALIDATION FAILURE:', errors.array())
        return res.json({ messageData, errors: errors.array() })
      }

      // Find user IDs based on usernames
      const sender = await prisma.wreathe_user.findUnique({
        where: { username: req.user.username },
      })
      const recepient = await prisma.wreathe_user.findUnique({
        where: { username: req.params.recepientUsername },
      })
      if (!sender || !recepient) {
        return res.status(404).json({ error: 'Sender or recipient not found' })
      }

      messageData.recepient_ref = recepient.user_uid
      // Create a direct message
      const directMessage = await prisma.message.create({
        data: messageData,
      })

      return res.status(201).json({
        success: true,
        message: 'MESSAGE WAS SUCCESSFULLY SENT',
        directMessage,
      })
    } catch (err) {
      console.error('THERE WAS AN ISSUE CREATING/SENDING THE MESSAGE', err)
      return res
        .status(403)
        .json({ err, message: 'there was an issue creating a message' })
    }
  },
]

// export const messageDelete = (req: Request, res: Response) => {
//   console.log(req.params)
// }
// export const messagePut = (req: Request, res: Response) => {
//   console.log(req.params)
// }
