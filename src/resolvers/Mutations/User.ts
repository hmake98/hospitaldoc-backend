import { stringArg, extendType, nonNull, intArg } from 'nexus'
import { compare, hash } from 'bcrypt'
import { generateAccessToken, handleError } from '../../utils/helpers'
import { errors } from '../../utils/constants'

export const user = extendType({
  type: 'Mutation',
  definition(t) {
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

    t.field('createSubAdmin', {
      type: 'AuthPayload',
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, { name, email, password }, ctx) {
        try {
          const hashedPassword = await hash(password, 10)
          const user = await ctx.prisma.user.create({
            data: {
              name,
              email,
              password: hashedPassword,
              role: 'SUBADMIN',
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

    t.field('createHospital', {
      type: 'Hospital',
      args: {
        name: nonNull(stringArg()),
        subAdminId: nonNull(intArg()),
      },
      async resolve(_parent, { name, subAdminId }, ctx) {
        return ctx.prisma.hospital.create({
          data: {
            name,
            created_by: {
              connect: {
                id: subAdminId,
              },
            },
          },
        })
      },
    })

    t.field('updateHospital', {
      type: 'Hospital',
      args: {
        name: stringArg(),
        hospitalId: nonNull(intArg()),
        subAdminId: intArg(),
      },
      async resolve(_parent, { name, hospitalId, subAdminId }, ctx) {
        return ctx.prisma.hospital.update({
          where: {
            id: hospitalId,
          },
          data: {
            name,
            created_by: subAdminId
              ? {
                  connect: {
                    id: subAdminId,
                  },
                }
              : {},
          },
        })
      },
    })

    t.field('deleteHospital', {
      type: 'Hospital',
      args: {
        hospitalId: nonNull(intArg()),
      },
      async resolve(_parent, { hospitalId }, ctx) {
        return ctx.prisma.hospital.delete({
          where: { id: hospitalId },
        })
      },
    })

    t.field('createDocument', {
      type: 'Document',
      args: {
        name: nonNull(stringArg()),
        barcode: nonNull(stringArg()),
        link: nonNull(stringArg()),
      },
      async resolve(_parent, { name, barcode, link }, ctx) {
        return ctx.prisma.document.create({
          data: {
            barcode,
            name,
            link,
            created_by: {
              connect: {
                userId: ctx.user.id,
              },
            },
          },
        })
      },
    })

    t.field('updateDocument', {
      type: 'Document',
      args: {
        docId: nonNull(intArg()),
        name: nonNull(stringArg()),
        barcode: nonNull(stringArg()),
        link: nonNull(stringArg()),
      },
      async resolve(_parent, { name, barcode, link, docId }, ctx) {
        return ctx.prisma.document.update({
          where: { id: docId },
          data: {
            barcode,
            name,
            link,
          },
        })
      },
    })

    t.field('deleteDocument', {
      type: 'Document',
      args: {
        docId: nonNull(intArg()),
      },
      async resolve(_parent, { docId }, ctx) {
        return ctx.prisma.document.delete({
          where: { id: docId },
        })
      },
    })
  },
})
