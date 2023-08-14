import type { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/* GET users listing. */
export const profileGet = async (req: Request, res: Response) => {
  try {
    const foundUser = await prisma.wreathe_user.findUniqueOrThrow({
      //change the method to grab userid
      where: { user_uid: req.body.userId },
    })
    return res.json({ foundUser })
  } catch (err) {
    return res
      .status(403)
      .json({ err, message: 'There was an error fetching the user' })
  }
}
