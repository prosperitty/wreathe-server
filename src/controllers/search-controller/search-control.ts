import type { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const searchForUser = [
  body('searchTerm')
    .trim()
    .toLowerCase()
    .isLowercase()
    .isLength({ min: 1, max: 50 })
    .notEmpty()
    .withMessage('Can not be empty. Maximum characters is 50.'),

  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      const searchTerm = req.body.searchTerm
      const searchedUsers = await prisma.wreathe_user.findMany({
        where: {
          username: {
            startsWith: searchTerm, // Case-insensitive search
          },
        },
        orderBy: {
          username: 'asc', // Sorting usernames in ascending order
        },
        take: 12,
      })
      if (!errors.isEmpty()) {
        console.error('VALIDATION FAILURE:', errors.array())
        return res.json({ searchTerm, errors: errors.array() })
      }
      return res.json({
        success: true,
        message: 'SUCCESSFULLY FETCHED FILTERED USERS BY SEARCH TERM',
        searchedUsers,
      })
    } catch (err) {
      console.error(err)
      return res
        .status(403)
        .json({ success: false, message: 'Internal Server Error' })
    }
  },
]
