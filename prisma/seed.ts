import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {}

main().finally(async () => {
  await prisma.$disconnect()
})
