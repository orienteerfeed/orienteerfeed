import merge from 'lodash.merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  typeDef as Event,
  resolvers as eventResolvers,
} from './event/index.js';
import {
  typeDef as Class,
  resolvers as classResolvers,
} from './class/index.js';
import {
  typeDef as Sport,
  resolvers as sportResolvers,
} from './sport/index.js';
import {
  typeDef as Competitor,
  resolvers as competitorResolvers,
} from './competitor/index.js';

// based on - https://www.apollographql.com/blog/backend/schema-design/modularizing-your-graphql-schema-code/
const Query = /* GraphQL */ `
  type Query {
    _empty: String
  }
`;

const Mutation = /* GraphQL */ `
  type Mutation {
    _empty(nothing: String): String
  }
`;

const resolvers = {};

export const schema = makeExecutableSchema({
  typeDefs: [Query, Mutation, Event, Class, Sport, Competitor],
  resolvers: merge(
    resolvers,
    eventResolvers,
    classResolvers,
    sportResolvers,
    competitorResolvers,
  ),
});
