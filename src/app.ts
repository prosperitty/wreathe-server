import 'dotenv/config'
import createError from 'http-errors'
import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'

// const { PrismaClient } = require('@prisma/client');
import compression from 'compression'
import helmet from 'helmet'

import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import loginRouter from './routes/login.js'
import logoutRouter from './routes/logout.js'
import registerRouter from './routes/register.js'

// const prisma = new PrismaClient();
const app: Express = express()

if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      credentials: true,
    }),
  )
}

app.use(helmet())
app.use(compression())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use('/register', registerRouter)

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404))
})

// error handler
app.use(function (
  err: { message: string; status: number },
  req: Request,
  res: Response,
) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
