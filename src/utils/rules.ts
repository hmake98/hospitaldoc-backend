import { shield, rule, and, allow } from 'graphql-shield'
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
}

export const permissions = shield(
  {
    Query: {
      me: rules.isAuthenticatedUser,
      getHospitalList: and(rules.isAuthenticatedUser, rules.isAdmin),
      getDocumentList: and(rules.isAuthenticatedUser, rules.isAdmin),
      getDocumentPresign: and(rules.isAuthenticatedUser, rules.isSubAdmin),
      '*': allow,
    },
    Mutation: {
      createHospital: and(rules.isAuthenticatedUser, rules.isAdmin),
      updateHospital: and(rules.isAuthenticatedUser, rules.isAdmin),
      deleteHospital: and(rules.isAuthenticatedUser, rules.isAdmin),
      createDocument: and(rules.isAuthenticatedUser, rules.isSubAdmin),
      updateDocument: and(rules.isAuthenticatedUser, rules.isSubAdmin),
      deleteDocument: and(rules.isAuthenticatedUser, rules.isSubAdmin),
      createSubAdmin: and(rules.isAuthenticatedUser, rules.isAdmin),
      '*': allow,
    },
  },
  { fallbackRule: allow }
)
