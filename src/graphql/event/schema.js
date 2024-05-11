export const typeDef = /* GraphQL */ `
  extend type Query {
    events: [Event!]!
    event(id: String!): Event
    eventsBySport(sportId: Int!): [Event!]
    eventsByUser(userId: Int!): [Event!]
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
    ranking: Boolean!
    coefRanking: Float
    startMode: String!
    countryId: String
    published: Boolean!
    authorId: Int
    createdAt: String!
    updatedAt: String!
    classes: [Class!]
    sport: Sport!
    country: Country
  }
`;
