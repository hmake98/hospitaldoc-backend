import { shield, rule, and, allow, or } from 'graphql-shield'
import { Context } from '../types'
import { handleError } from './helpers'
import { errors } from './constants'

export const rules = {
  isAuthenticatedUser: rule({ cache: 'contextual' })(
    (_parent, _args, ctx: Context) => {
      try {
        console.log(!ctx.user)
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
      // me: rules.isAuthenticatedUser,
      // getHospitalList: and(
      //   rules.isAuthenticatedUser
      //   // or(rules.isAdmin, rules.isSubAdmin)
      // ),
      // getDocumentList: and(
      //   rules.isAuthenticatedUser
      //   // or(rules.isAdmin, rules.isSubAdmin, rules.isHospital)
      // ),
      // getSubadminList: and(rules.isAuthenticatedUser, rules.isAdmin),
      // getDocumentPresign: and(
      //   rules.isAuthenticatedUser
      //   // or(rules.isAdmin, rules.isSubAdmin)
      // ),
      '*': allow,
    },
    Mutation: {
      // createHospital: rules.isAuthenticatedUser,
      // // or(rules.isAdmin, rules.isSubAdmin)
      // updateHospital: and(
      //   rules.isAuthenticatedUser
      //   // or(rules.isAdmin, rules.isSubAdmin)
      // ),
      // deleteHospital: and(
      //   rules.isAuthenticatedUser
      //   // or(rules.isAdmin, rules.isSubAdmin)
      // ),
      // createDocument: and(rules.isAuthenticatedUser, rules.isSubAdmin),
      // updateDocument: and(rules.isAuthenticatedUser, rules.isSubAdmin),
      // deleteDocument: and(rules.isAuthenticatedUser, rules.isSubAdmin),
      // createSubAdmin: and(rules.isAuthenticatedUser, rules.isAdmin),
      '*': allow,
    },
  },
  { fallbackRule: allow }
)
