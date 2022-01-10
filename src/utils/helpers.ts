import { PrismaClient, User } from '@prisma/client'
import { PubSub } from 'apollo-server'
import { sign, verify } from 'jsonwebtoken'
import { APP_SECRET, tokens } from './constants'
import { Context, Token } from '../types'

export const handleError = (error: any) => {
  // add any other logging mechanism here e.g. Sentry
  throw error
}

export const generateAccessToken = (user: User) => {
  delete user.password
  const accessToken = sign(
    {
      user,
      type: tokens.access.name,
      timestamp: Date.now(),
    },
    APP_SECRET,
    {
      expiresIn: tokens.access.expiry,
    }
  )
  return accessToken
}

export const prisma = new PrismaClient()
const pubsub = new PubSub()

export const createContext = (ctx: any): Context => {
  let user: User
  try {
    let Authorization = ''
    try {
      // for queries and mutations
      Authorization = ctx.req.get('Authorization')
    } catch (e) {
      // specifically for subscriptions as the above will fail
      Authorization = ctx?.connection?.context?.Authorization
    }
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, APP_SECRET) as Token
    
    if (!verifiedToken.user && verifiedToken.type !== tokens.access.name)
      user = null
    else user = verifiedToken.user
  } catch (e) {
    user = null
  }
  return {
    ...ctx,
    prisma,
    pubsub,
    user,
  }
}
