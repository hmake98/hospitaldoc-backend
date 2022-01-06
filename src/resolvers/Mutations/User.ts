import { stringArg, extendType, nonNull, intArg } from 'nexus'
import { compare, hash } from 'bcrypt'
import { generateAccessToken, handleError } from '../../utils/helpers'
import { errors } from '../../utils/constants'
import { Role } from '@prisma/client'

export const user = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'AuthPayload',
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        role: nonNull(intArg()),
      },
      async resolve(_parent, { name, email, password, role }, ctx) {
        try {
          const hashedPassword = await hash(password, 10)
          let userRole: Role
          switch (role) {
            case 1:
              userRole = 'CLIENT'
            case 2:
              userRole = 'USER'
          }
          const user = await ctx.prisma.user.create({
            data: {
              name,
              email,
              password: hashedPassword,
              role: userRole,
            },
          })

          const accessToken = generateAccessToken(user)
          return {
            accessToken,
            user,
          }
        } catch (e) {
          handleError(errors.userAlreadyExists)
        }
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, { email, password }, ctx) {
        let user = null
        try {
          user = await ctx.prisma.user.findUnique({
            where: {
              email,
            },
          })
        } catch (e) {
          handleError(errors.invalidUser)
        }

        if (!user) handleError(errors.invalidUser)

        const passwordValid = await compare(password, user.password)
        if (!passwordValid) handleError(errors.invalidUser)

        const accessToken = generateAccessToken(user)
        return {
          accessToken,
          user,
        }
      },
    })

    t.field('createHospital', {
      type: 'Hospital',
      args: {
        name: nonNull(stringArg()),
      },
      async resolve(_parent, { name }, ctx) {
        return ctx.prisma.hospital.create({
          data: {
            name,
            created_by: {
              connect: {
                id: ctx.user.id,
              },
            },
          },
        })
      },
    })
  },
})
