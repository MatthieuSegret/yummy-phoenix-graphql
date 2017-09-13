import ApolloClient, { createNetworkInterface } from 'react-apollo';
import ROOT_URL from 'config/rootUrl';

const networkInterface = createNetworkInterface({
  uri: `${ROOT_URL}/graphql`,
  opts: {
    credentials: process.env.NODE_ENV === 'development' ? 'include' : 'same-origin'
  }
});

networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {}; // Create the header object if needed.
      }
      // get the authentication token from local storage if it exists
      const token = window.localStorage.getItem('yummy:token');
      req.options.headers.authorization = token ? `Bearer ${token}` : null;
      next();
    }
  }
]);

export default new ApolloClient({
  networkInterface,
  queryDeduplication: true
});
