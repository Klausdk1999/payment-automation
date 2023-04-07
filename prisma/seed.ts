import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { cpf_cnpj: "00758352905" },
    update: {},
    create: {
      email: "admin@email.com",
      password: bcrypt.hashSync("123123", 10),
      name: "Admin Klaus",
      role: "admin",
      cpf_cnpj: "00758352905"
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
