import { prisma } from "../src/db.js";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.error("Usage: npx tsx prisma/change-password.ts <email> <new-password>");
    process.exit(1);
  }

  console.log(`Checking if user with email "${email}" exists...`);
  const admin = await prisma.adminUser.findUnique({
    where: { email }
  });

  if (!admin) {
    console.error(`Error: Admin user with email "${email}" not found.`);
    process.exit(1);
  }

  console.log("Hashing new password...");
  const passwordHash = await bcrypt.hash(newPassword, 10);

  console.log("Updating password in database...");
  await prisma.adminUser.update({
    where: { email },
    data: { passwordHash }
  });

  console.log("Password updated successfully! ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
