import prisma from '../../utils/context.js';
export const events = (parent, _, context) => {
  return prisma.event.findMany();
};

export const event = (_, { id }, context) => {
  return prisma.event.findUnique({
    where: { id: id },
  });
};
