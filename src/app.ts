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

import compression from 'compression'
import helmet from 'helmet'

import feedRouter from './routes/feed.js'
import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import loginRouter from './routes/login.js'
import logoutRouter from './routes/logout.js'
import searchRouter from './routes/search.js'
import composeRouter from './routes/compose.js'
import registerRouter from './routes/register.js'
import messagesRouter from './routes/messages.js'

const app: Express = express()
app.use(helmet())
app.set('trust proxy', 1)

if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  )
} else {
  app.use(
    cors({
      origin: 'https://wreathe.vercel.app',
      methods: 'GET,POST,PUT,DELETE,OPTIONS',
      credentials: true,
    }),
  )
  // app.use(function (req, res, next) {
  //   res.header('Access-Control-Allow-Origin', 'https://wreathe.vercel.app')
  //   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  //   res.header(
  //     'Access-Control-Allow-Headers',
  //     'Origin, X-Requested-With, Content-Type, Accept',
  //   )
  //   next()
  // })
}

app.use(compression())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

app.use('/', indexRouter)
app.use('/feed', feedRouter)
app.use('/users', usersRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use('/search', searchRouter)
app.use('/compose', composeRouter)
app.use('/messages', messagesRouter)
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

// const server = createServer()
// const io = new Server(server, {
//   cors: {
//     origin: ['http://localhost:3000', 'http://localhost:8080'], // Replace with your frontend URL
//     // allowedHeaders: ["my-custom-header"],
//     credentials: true,
//   },
// })
