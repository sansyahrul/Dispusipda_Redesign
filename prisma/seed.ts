import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@dispusipda.go.id" },
    update: {},
    create: {
      email: "admin@dispusipda.go.id",
      password: hashedPassword,
      name: "Admin DISPUSIPDA",
    },
  });

  console.log("✅ User admin berhasil dibuat!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
