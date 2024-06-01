export interface NewUser {
  first_name: string
  last_name: string
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

interface UserData {
  user_uid: string
  first_name: string
  last_name: string
  email: string | null
  username: string
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
