import { extendType, intArg, nonNull, stringArg } from 'nexus'
import { S3 } from 'aws-sdk'

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

export const user = extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: 'User',
      async resolve(_parent, _args, ctx) {
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: ctx.user.id,
          },
        })
        return user
      },
    })

    t.field('putDocumentPresign', {
      type: 'String',
      args: { fileName: nonNull(stringArg()), docId: nonNull(intArg()) },
      async resolve(_parent, { fileName, docId }, ctx) {
        await ctx.prisma.document.update({
          data: {
            link: fileName,
          },
          where: {
            id: docId,
          },
        })
        return await s3.getSignedUrlPromise('putObject', {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `${docId}/${fileName}`,
          Expires: 3600,
        })
      },
    })

    t.field('getDocumentPresign', {
      type: 'String',
      args: { docId: nonNull(intArg()), fileName: nonNull(stringArg()) },
      async resolve(_parent, { docId, fileName }, ctx) {
        if (ctx.user.role === 'HOSPITAL') {
          console.log(ctx.user.role);
          const response = await ctx.prisma.document.update({
            where: {
              id: docId,
            },
            data: {
              viewCount: { increment: 1 },
            },
          })
          console.log(response);
        }
        return await s3.getSignedUrlPromise('getObject', {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `${docId}/${fileName}`,
          Expires: 3600,
        })
      },
    })

    t.list.field('getSubadminList', {
      type: 'User',
      args: {
        take: nonNull(intArg()),
        skip: nonNull(intArg()),
        search: stringArg(),
      },
      async resolve(_parent, { skip, take, search }, ctx) {
        return ctx.prisma.user.findMany({
          where: {
            email: {
              contains: search,
              mode: 'insensitive',
            },
            name: {
              contains: search,
              mode: 'insensitive',
            },
            role: 'SUBADMIN',
          },
          skip,
          take,
        })
      },
    })

    t.list.field('getHospitalList', {
      type: 'User',
      args: {
        take: nonNull(intArg()),
        skip: nonNull(intArg()),
        search: stringArg(),
        subAdminId: nonNull(intArg()),
      },
      async resolve(_parent, { skip, take, search, subAdminId }, ctx) {
        return ctx.prisma.user.findMany({
          where: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
            role: 'HOSPITAL',
            subAdminId,
          },
          skip,
          take,
        })
      },
    })

    t.list.field('getDocumentList', {
      type: 'Document',
      args: {
        hospitalId: intArg(),
        take: nonNull(intArg()),
        skip: nonNull(intArg()),
        barcode: stringArg(),
        search: stringArg(),
      },
      async resolve(_parent, { skip, take, search, barcode, hospitalId }, ctx) {
        return ctx.prisma.document.findMany({
          where: {
            hospitalId: hospitalId,
            barcode: {
              equals: barcode,
            },
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          skip,
          take,
        })
      },
    })
  },
})
