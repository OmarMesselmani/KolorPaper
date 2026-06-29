import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const query = "dino";
  
  const tagsCount = await prisma.tag.count();
  console.log("Total tags in Tag table:", tagsCount);

  const tags = await prisma.tag.findMany({
    where: {
      name: { contains: query }
    }
  });

  console.log("Matching Tags from Tag table:", tags);
}

main().catch(console.error).finally(() => prisma.$disconnect());
