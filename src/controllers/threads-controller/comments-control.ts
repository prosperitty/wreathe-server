import type { Request, Response } from 'express'

export const commentsGet = (req: Request, res: Response) => {
  res.send('list of comments in a thread page')
}
