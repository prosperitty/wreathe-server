import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt = require('jsonwebtoken');
import 'dotenv/config';
import { LoginCredentials } from '../utils/types';
import {
  setAccessToken,
  setRefreshToken,
  setUserData,
} from '../utils/cookie-setter';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const loginGet = (req: Request, res: Response) => {
  res.send('login page');
};

const secret: string = process.env.JWT_KEY as string;
const encodedKey = new TextEncoder().encode(secret);

export const loginPost = async (req: Request, res: Response) => {
  try {
    const { username, password }: LoginCredentials = req.body;
    if (!(username && password)) {
      console.error('MISSING CREDENTIALS!');
      return res.status(400).json({ message: 'MISSING CREDENTIALS' });
    }

    // Authenticate the user by fetching user from DB by username(username)
    const user = await prisma.wreathe_user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      console.error('USER DOES NOT EXIST!');
      return res.status(401).json({ error: 'USER DOES NOT EXIST!' });
    }
    const passwordMatch = await bcrypt.compare(password, user.user_password);
    if (!passwordMatch) {
      console.error('PASSWORD DOES NOT MATCH!');
      return res.status(401).json({ error: 'PASSWORD DOES NOT MATCH' });
    }

    //Refresh token
    const payload = { id: user.user_uid, username: user.username };
    const accessToken = jwt.sign(payload, encodedKey, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, encodedKey, { expiresIn: '1d' });

    //add refreshToken to user and store in DB?
    await prisma.wreathe_user.update({
      where: { user_uid: user.user_uid },
      data: { refresh_token: refreshToken },
    });

    const userData = {
      user_uid: user.user_uid,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      username: user.username,
    };

    setAccessToken(res, 'accessToken', accessToken, 60 * 60 * 1000);
    setRefreshToken(res, 'refreshToken', refreshToken, 24 * 60 * 60 * 1000);
    setUserData(res, 'userData', JSON.stringify(userData), 24 * 60 * 60 * 1000);

    // Send the access token in the response
    return res.json({ accessToken, userData });
  } catch (err) {
    console.error('THERE WAS IN ISSUE LOGGING IN', err);
    return res
      .status(403)
      .json({ err, message: 'There was an issue logging in' });
  }
};

//FAKE USER ONLY MAKE SURE TO DELETE
// const encryptedPassword = await bcrypt.hash('password', 10)
// const user: User = {
//   id: '123',
//   firstName: 'first',
//   lastName: 'last',
//   email: email,
//   password: encryptedPassword,
//   refreshToken: null!,
// }

// user.refreshToken = refreshToken
