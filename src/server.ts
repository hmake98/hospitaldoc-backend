import { config } from 'dotenv'
config()

import { ApolloServer } from 'apollo-server-express'
import { applyMiddleware } from 'graphql-middleware'
import { schema } from './schema'
import { isDev } from './utils/constants'
import { createContext } from './utils/helpers'

export const server = new ApolloServer({
  schema: applyMiddleware(schema),
  context: createContext,
  introspection: true,
  debug: isDev(),
})
