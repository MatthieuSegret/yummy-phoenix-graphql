import ApolloClient, { createNetworkInterface } from 'react-apollo';
import ROOT_URL from 'config/rootUrl';

const networkInterface = createNetworkInterface({
  uri: `${ROOT_URL}/graphql`,
  opts: {
    credentials: process.env.NODE_ENV === 'development' ? 'include' : 'same-origin'
  }
});

export default new ApolloClient({
  networkInterface,
  queryDeduplication: true
});
