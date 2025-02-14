import prisma from '../../utils/context.js';
export const events = (parent, _, context) => {
  return prisma.event.findMany();
};

export const event = (_, { id }, context) => {
  return prisma.event.findUnique({
    where: { id: id },
  });
};

export const eventsBySport = (_, { sportId }, context) => {
  return prisma.event.findMany({
    where: { sportId: sportId },
  });
};

export const eventsByUser = (_, { userId }, context) => {
  return prisma.event.findMany({
    where: { authorId: userId },
  });
};

export const searchEvents = async (_, { query }) => {
  return prisma.$queryRaw`
    SELECT * FROM Event
    WHERE MATCH(name, location, organizer) AGAINST(${query} IN BOOLEAN MODE);
  `;
};
