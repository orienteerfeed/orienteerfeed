import prisma from '../../utils/context.js';
export const competitorById = (_, { id }, context) => {
  return prisma.competitor.findUnique({
    where: { id: id },
  });
};
export const competitorsByClass = (_, { id }, context) => {
  return prisma.competitor.findMany({
    where: { classId: id },
  });
};
export const competitorsByTeam = (_, { id }, context) => {
  return prisma.competitor.findMany({
    where: { teamId: id },
  });
};
