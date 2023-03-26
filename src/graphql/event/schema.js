export const typeDef = /* GraphQL */ `
  extend type Query {
    events: [Event!]!
    event(id: String!): Event
    eventsBySport(sportId: Int!): [Event!]
  }
  type Event {
    id: String!
    sportId: Int!
    name: String!
    organizer: String
    date: String!
    location: String
    zeroTime: String!
    relay: Boolean!
    published: Boolean!
    authorId: Int
    createdAt: String!
    updatedAt: String!
    classes: [Class!]
    sport: Sport!
  }
`;
