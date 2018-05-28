import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import * as AbsintheSocket from '@absinthe/socket';
import { createAbsintheSocketLink } from '@absinthe/socket-apollo-link';
import { Socket as PhoenixSocket } from 'phoenix';

import { WS_ROOT_URL } from 'config/rootUrl';
import formatErrors from 'utils/errorsUtils';
import client from 'config/apolloClient';

import CREATE_FLASH_MESSAGE from 'graphql/flash/createFlashMessageMutation.graphql';

export const wsLink = createAbsintheSocketLink(AbsintheSocket.create(new PhoenixSocket(`${WS_ROOT_URL}/socket`)));

export const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('yummy:token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null
    }
  };
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
