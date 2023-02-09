export const typeDef = /* GraphQL */ `
  extend type Query {
    competitorById(id: Int!): Competitor!
    competitorsByClass(id: Int!): [Competitor!]
  }
  type Competitor {
    id: Int!
    class: Class!
    classId: Int!
    firstname: String!
    lastname: String!
    nationality: String
    registration: String!
    license: String
    ranking: Int
    organisation: String
    shortName: String
    card: Int
    startTime: String
    finishTime: String
    time: Int
    status: String
  }
`;
