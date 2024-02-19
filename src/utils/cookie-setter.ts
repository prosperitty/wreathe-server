import { Response, CookieOptions } from 'express'

export const setRefreshToken = (
  res: Response,
  name: string,
  token: string,
  maxAge: number,
) => {
  if (process.env.NODE_ENV !== 'production') {
    const options: CookieOptions = {
      // httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge,
      path: '/refresh-token',
    }
    return res.cookie(name, token, options)
  } else if (process.env.NODE_ENV === 'production') {
    const options: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge,
      path: '/refresh-token',
    }
    return res.cookie(name, token, options)
  }
}

export const setAccessToken = (
  res: Response,
  name: string,
  token: string,
  maxAge: number,
) => {
  if (process.env.NODE_ENV !== 'production') {
    const options: CookieOptions = {
      // httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge,
      path: '/',
    }
    return res.cookie(name, token, options)
  } else if (process.env.NODE_ENV === 'production') {
    const options: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge,
      path: '/',
    }
    return res.cookie(name, token, options)
  }
}

interface UserData {
  user_uid: string
  first_name: string
  last_name: string
  email: string | null
  username: string
}

export const setUserData = (
  res: Response,
  name: string,
  userData: UserData,
  maxAge: number,
) => {
  if (process.env.NODE_ENV !== 'production') {
    const options: CookieOptions = {
      // httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge,
      path: '/',
    }
    return res.cookie(name, userData, options)
  } else if (process.env.NODE_ENV === 'production') {
    const options: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge,
      path: '/',
    }
    return res.cookie(name, userData, options)
  }
}
