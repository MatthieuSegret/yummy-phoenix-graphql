import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { DedupLink } from 'apollo-link-dedup';
import { getMainDefinition } from 'apollo-utilities';
import { createUploadMiddleware } from 'apollo-absinthe-upload-link';
import { HttpLink } from 'apollo-link-http';

import { authLink, formatErrorsLink, onErrorLink, wsLink } from 'config/links';
import { flashMessageLocalLink } from 'components/flash/flashMessageLocalLink';

import ROOT_URL from 'config/rootUrl';

const opts = {
  uri: `${ROOT_URL}/graphql`,
  credentials: process.env.NODE_ENV === 'development' ? 'include' : 'same-origin'
};

const httpLink = ApolloLink.from([
  new DedupLink(),
  flashMessageLocalLink,
  onErrorLink,
  authLink,
  formatErrorsLink,
  createUploadMiddleware(opts),
  new HttpLink(opts)
]);

export default new ApolloClient({
  link: ApolloLink.split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation }: any = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
  ),
  cache: new InMemoryCache()
});
