import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from 'apollo-link-error';
import * as AbsintheSocket from '@absinthe/socket';
import { createAbsintheSocketLink } from '@absinthe/socket-apollo-link';
import { Socket as PhoenixSocket } from 'phoenix';
import { createUploadMiddleware } from 'apollo-absinthe-upload-link';
import { HttpLink } from 'apollo-link-http';

import { flashMessageLocalLink } from 'components/flash/flashMessageLocalLink';
import { WS_ROOT_URL } from 'config/rootUrl';
import formatErrors from 'utils/errorsUtils';

import CREATE_FLASH_MESSAGE from 'graphql/flash/createFlashMessageMutation.graphql';
import ROOT_URL from 'config/rootUrl';

///////////
// Links
///////////

export const authLink = new ApolloLink((operation: any, forward: any) => {
  const token = localStorage.getItem('yummy:token');
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null
    }
  }));

  return forward(operation);
});

export const onErrorLink = onError(({}) => {
  error("Oups, nous sommes désolés, mais quelque chose s'est mal passé");
});

export const formatErrorsLink = new ApolloLink((operation: any, forward: any) => {
  return forward(operation).map((response: any) => {
    const operationName: string = Object.keys(response.data)[0];
    const payload = response.data[operationName] || null;
    if (payload && payload.messages && payload.messages.length > 0) {
      response.data[operationName].errors = formatErrors(payload.messages);
      const errors = response.data[operationName].errors;
      if (errors.base) {
        error(errors.base);
      } else {
        error('Des erreurs ont eu lieu, veuillez vérifier :');
      }
    }
    return response;
  });
});

const error = (text: string) => {
  client.mutate({ mutation: CREATE_FLASH_MESSAGE, variables: { type: 'error', text } });
};

export const wsLink = createAbsintheSocketLink(AbsintheSocket.create(new PhoenixSocket(`${WS_ROOT_URL}/socket`)));

///////////////////////
// Initialize httpLink
///////////////////////

const urlOpts = {
  uri: `${ROOT_URL}/graphql`,
  credentials: 'same-origin'
};

const httpLink = ApolloLink.from([
  flashMessageLocalLink,
  onErrorLink,
  authLink,
  formatErrorsLink,
  createUploadMiddleware(urlOpts),
  new HttpLink(urlOpts)
]);

////////////////////////////
// Initialize apollo client
////////////////////////////

const client = new ApolloClient({
  link: ApolloLink.split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation }: any = getMainDefinition(query as any);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
  ),
  cache: new InMemoryCache()
});

export default client;
