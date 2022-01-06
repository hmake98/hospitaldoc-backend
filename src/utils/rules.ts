import { shield, rule, or, and } from 'graphql-shield'
import { Context } from '../types'
import { handleError } from './helpers'
import { errors } from './constants'

export const rules = {
  isAuthenticatedUser: rule({ cache: 'contextual' })(
    (_parent, _args, ctx: Context) => {
      try {
        if (!ctx.user) {
          return handleError(errors.notAuthenticated)
        }
        return true
      } catch (e) {
        return e
      }
    }
  ),
  isAdmin: rule({ cache: 'contextual' })((_parent, _args, ctx: Context) => {
    try {
      if (ctx.user && ctx.user.role !== 'ADMIN') {
        return handleError(errors.notAuthenticated)
      }
      return true
    } catch (e) {
      return e
    }
  }),
  isClient: rule({ cache: 'contextual' })((_parent, _args, ctx: Context) => {
    try {
      if (ctx.user && ctx.user.role !== 'CLIENT') {
        return handleError(errors.notAuthenticated)
      }
      return true
    } catch (e) {
      return e
    }
  }),
}

export const permissions = shield({
  Query: {
    me: rules.isAuthenticatedUser,
  },
  Mutation: {
    createHospital: and(rules.isAuthenticatedUser, rules.isAdmin),
  },
})
