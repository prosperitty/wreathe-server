import type { Request, Response, Router } from 'express'

/* GET users listing. */
export const usersGet = (req: Request, res: Response) => {
  res.send('this is the users/ path')
}
