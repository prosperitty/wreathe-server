import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
import createError from 'http-errors';
import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// const { PrismaClient } = require('@prisma/client');
import compression from 'compression';
import helmet from 'helmet';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

// const prisma = new PrismaClient();
const app: Express = express();

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
