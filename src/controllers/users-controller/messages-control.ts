import type { Request, Response } from 'express'

export const messagesGet = (req: Request, res: Response) => {
  res.send('list of the users messages page')
}
