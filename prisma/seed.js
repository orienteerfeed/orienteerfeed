import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const orienteering = await prisma.sport.upsert({
    where: { name: 'Orienteering' },
    update: {},
    create: {
      name: 'Orienteering',
    },
  });
  console.log({ orienteering });
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
