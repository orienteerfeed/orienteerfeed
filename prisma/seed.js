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
  const eventName = process.env.EVENT_NAME;
  const date = process.env.DATE && new Date(process.env.DATE);
  const organizer = process.env.ORGANIZER && process.env.ORGANIZER;
  const zeroTime = process.env.ZERO_TIME && new Date(process.env.ZERO_TIME);
  const isRelay = process.env.RELAY && Boolean(Number(process.env.RELAY));
  const location = process.env.LOCATION && process.env.LOCATION;

  const defaultEvent = await prisma.event.create({
    data: {
      name: eventName,
      date: date,
      organizer: organizer,
      zeroTime: zeroTime,
      relay: isRelay,
      location: location,
      sportId: 1,
      published: true,
    },
  });
  console.log({ defaultEvent });
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
