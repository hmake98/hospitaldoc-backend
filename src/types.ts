import { PrismaClient, User } from '@prisma/client'
import { PubSub } from 'apollo-server'
import { Request, Response } from 'express'

export interface Context {
  prisma: PrismaClient
  req: Request
  res: Response
  pubsub: PubSub
  user: User
}

export interface Token {
  user: User
  type: string
  timestamp: number
}
