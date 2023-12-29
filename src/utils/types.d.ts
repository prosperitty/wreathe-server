export interface NewUser {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  refreshToken: string
}

export interface RequestUser {
  id: string
  username: string
  iat: number
  exp: number
}

export interface LoginCredentials {
  username: string
  password: string
}

declare module 'express-serve-static-core' {
  interface Request {
    user: RequestUser
  }
}
