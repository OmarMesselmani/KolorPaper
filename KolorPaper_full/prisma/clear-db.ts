import { prisma } from '../../src/lib/db';
async function main() {
  console.log('Clearing database...');

  // Delete all records from tables
  await prisma.pageView.deleteMany();
  await prisma.coloringPage.deleteMany();
  await prisma.category.deleteMany();
  
  console.log('Database cleared successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
