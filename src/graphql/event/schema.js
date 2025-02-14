export const typeDef = /* GraphQL */ `
  extend type Query {
    events: [Event!]!
    event(id: String!): Event
    eventsBySport(sportId: Int!): [Event!]
    eventsByUser(userId: Int!): [Event!]
    searchEvents(query: String!): [Event]!
  }
  type Event {
    id: String!
    sportId: Int!
    name: String!
    organizer: String
    date: String!
    timezone: String!
    location: String
    latitude: Float
    longitude: Float
    zeroTime: String!
    relay: Boolean!
    ranking: Boolean!
    coefRanking: Float
    hundredthPrecision: Boolean!
    startMode: String!
    countryId: String
    published: Boolean!
    demo: Boolean!
    authorId: Int
    createdAt: String!
    updatedAt: String!
    classes: [Class!]
    sport: Sport!
    country: Country
    eventPassword: EventPassword
  }
`;
