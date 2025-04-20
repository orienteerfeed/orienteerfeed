import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { useAuth } from './auth'; // Import your useAuth hook
import { config } from '../config';

const baseApiUrl = config.BASE_API_URL;

// Generate the WebSocket URL by replacing the protocol
const wsUrl = baseApiUrl.replace(/^http/, 'ws');

export const ApolloWrapper = ({ children }) => {
  const { token } = useAuth(); // Use the hook here

  // HTTP link for queries and mutations
  const httpLink = createHttpLink({
    uri: `${baseApiUrl}/graphql`,
  });

  // Set up authLink to add Authorization header to HTTP requests
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  // WebSocket link for subscriptions
  const wsLink = new GraphQLWsLink(
    createClient({
      url: `${wsUrl}/graphql`,
      connectionParams: {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      },
    }),
  );

  // Use split for directing operations to either HTTP or WebSocket link
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    authLink.concat(httpLink), // Combine authLink and httpLink
  );

  // Apollo Client instance
  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
