import type { Request, Response } from 'express'

export const threadsGet = (req: Request, res: Response) => {
  res.send('list of threads page')
}
