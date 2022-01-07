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

    t.field('getDocumentPresign', {
      type: 'String',
      args: { fileName: nonNull(stringArg()) },
      async resolve(_parent, { fileName }, ctx) {
        return await s3.getSignedUrlPromise('putObject', {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `${ctx.user.id}/${fileName}`,
          Expires: 3600,
        })
      },
    })

    t.list.field('getHospitalList', {
      type: 'Hospital',
      args: {
        limit: nonNull(intArg()),
        skip: nonNull(intArg()),
        search: stringArg(),
      },
      async resolve(_parent, { skip, take, search }, ctx) {
        return ctx.prisma.hospital.findMany({
          where: {
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

    t.list.field('getDocumentList', {
      type: 'Document',
      args: {
        hospitalId: intArg(),
        limit: nonNull(intArg()),
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
