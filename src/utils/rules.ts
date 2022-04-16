import { shield, rule, and, allow, or } from 'graphql-shield'
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
  isSubAdmin: rule({ cache: 'contextual' })((_parent, _args, ctx: Context) => {
    try {
      if (ctx.user && ctx.user.role !== 'SUBADMIN') {
        return handleError(errors.notAuthenticated)
      }
      return true
    } catch (e) {
      return e
    }
  }),
  isHospital: rule({ cache: 'contextual' })((_parent, _args, ctx: Context) => {
    try {
      if (ctx.user && ctx.user.role !== 'HOSPITAL') {
        return handleError(errors.notAuthenticated)
      }
      return true
    } catch (e) {
      return e
    }
  }),
}

export const permissions = shield(
  {
    Query: {
      '*': allow,
    },
    Mutation: {
      '*': allow,
    },
  },
  { fallbackRule: allow }
)
