import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { DedupLink } from 'apollo-link-dedup';
import { getMainDefinition } from 'apollo-utilities';

import { authLink, formatErrorsLink, onErrorLink, wsLink, httpWithUploadLink } from 'config/links';
import { flashMessageLocalLink } from 'components/flash/flashMessageLocalLink';

const httpLink = ApolloLink.from([
  new DedupLink(),
  flashMessageLocalLink,
  onErrorLink,
  authLink,
  formatErrorsLink,
  httpWithUploadLink
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
