import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { authLink, formatErrorsLink, errorLink, httpLink } from 'config/links';

export default new ApolloClient({
  link: ApolloLink.from([authLink, formatErrorsLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
  queryDeduplication: true
});
