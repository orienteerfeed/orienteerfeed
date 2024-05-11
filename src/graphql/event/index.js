import { typeDef } from './schema.js';
import * as queries from './query.js';
import * as mutations from './mutation.js';
import prisma from '../../utils/context.js';

export { typeDef, resolvers };

const resolvers = {
  Query: {
    ...queries,
  },
  Mutation: {
    ...mutations,
  },
  Event: {
    classes(parent, _, context) {
      return prisma.class.findMany({
        where: { eventId: parent.id },
      });
    },
    sport(parent, _, context) {
      return prisma.sport.findUnique({
        where: { id: parent.sportId },
      });
    },
    country(parent, _, context) {
      return prisma.country.findUnique({
        where: { countryCode: parent.countryId },
      });
    },
  },
};
