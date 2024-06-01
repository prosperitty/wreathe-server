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
      path: '/logout',
    }
    return res.cookie(name, token, options)
  } else if (process.env.NODE_ENV === 'production') {
    const options: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge,
      path: '/logout',
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

export const setUserData = (
  res: Response,
  name: string,
  userData: string,
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
