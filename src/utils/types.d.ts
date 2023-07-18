export interface NewUser {
  firstName: string
  lastName: string
  email: string
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

declare module 'express-serve-static-core' {
  interface Request {
    user: object | string
  }
}
