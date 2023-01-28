import prisma from '../../utils/context.js';
export const competitorById = (_, { id }, context) => {
  return prisma.competitor.findUnique({
    where: { id: id },
  });
};
export const eventCompetitors = (_, { eventId }, context) => {
  return prisma.competitor.findMany({
    where: { eventId: eventId },
  });
};
