import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import React from 'react';
import { useAuth } from './auth'; // Import your useAuth hook
import { config } from '../config';

// Create an http link for Apollo Client
const httpLink = createHttpLink({
  uri: `${config.BASE_API_URL}/graphql`, // Replace with your GraphQL endpoint
});

export const ApolloWrapper = ({ children }) => {
  const { token } = useAuth(); // Get the token from your hook

  // Set the context to add the Authorization header
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  // Create the Apollo Client and combine the authLink with httpLink
  const client = new ApolloClient({
    link: authLink.concat(httpLink), // Combine authLink and httpLink
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
