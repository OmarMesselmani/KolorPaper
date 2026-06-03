import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const page = await prisma.coloringPage.findFirst();
  console.log(page?.imageUrl);
  await prisma.$disconnect();
}
main();
