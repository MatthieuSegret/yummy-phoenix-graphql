// The MIT License (MIT)
// Copyright (c) 2016 - 2017 Meteor Development Group, Inc.
// Workarround to support upload with apollo and absinthe
// This file come from Apollo link
// From https://github.com/apollographql/apollo-link/blob/master/packages/apollo-link-http/src/httpLink.ts

import { ApolloLink, Observable } from 'apollo-link';
import { print } from 'graphql/language/printer';
import { extractFiles } from 'extract-files';

let AbortController;

const parseAndCheckResponse = request => response => {
  return response
    .json()
    .then(result => {
      if (response.status >= 300) throw new Error(`Response not successful: Received status code ${response.status}`);
      if (!result.hasOwnProperty('data') && !result.hasOwnProperty('errors')) {
        throw new Error(`Server response was missing for query '${request.operationName}'.`);
      }
      return result;
    })
    .catch(e => {
      const httpError = new Error(`Network request failed with status ${response.status} - "${response.statusText}"`);
      httpError.response = response;
      httpError.parseError = e;
      httpError.statusCode = response.status;

      throw httpError;
    });
};

const checkFetcher = fetcher => {
  if (fetcher.use && fetcher.useAfter && fetcher.batchUse && fetcher.batchUseAfter) {
    throw new Error(`
      It looks like you're using apollo-fetch! Apollo Link now uses the native fetch
      implementation, so apollo-fetch is not needed. If you want to use your existing
      apollo-fetch middleware, please check this guide to upgrade:
        https://github.com/apollographql/apollo-link/blob/master/docs/implementation.md
    `);
  }
};

const warnIfNoFetch = fetcher => {
  if (!fetcher && typeof fetch === 'undefined') {
    let library = 'unfetch';
    if (typeof window === 'undefined') library = 'node-fetch';
    throw new Error(
      `fetch is not found globally and no fetcher passed, to fix pass a fetch for
      your environment like https://www.npmjs.com/package/${library}.
      For example:
        import fetch from '${library}';
        import { createHttpLink } from 'apollo-link-http';
        const link = createHttpLink({ uri: '/graphql', fetch: fetch });
      `
    );
  }
};

const createSignalIfSupported = () => {
  if (typeof AbortController === 'undefined') return { controller: false, signal: false };

  const controller = new AbortController();
  const signal = controller.signal;
  return { controller, signal };
};

export const createHttpLink = ({ uri, fetch: fetcher, includeExtensions, ...requestOptions } = {}) => {
  // dev warnings to ensure fetch is present
  warnIfNoFetch(fetcher);
  if (fetcher) checkFetcher(fetcher);

  // use default global fetch is nothing passed in
  if (!fetcher) fetcher = fetch;
  if (!uri) uri = '/graphql';

  return new ApolloLink(
    operation =>
      new Observable(observer => {
        const { headers, credentials, fetchOptions = {}, uri: contextURI } = operation.getContext();
        const { operationName, extensions, variables, query } = operation;

        const body = {
          operationName,
          variables,
          query: print(query)
        };
        if (includeExtensions) body.extensions = extensions;

        let options = fetchOptions;
        if (requestOptions.fetchOptions) options = { ...requestOptions.fetchOptions, ...options };
        const fetcherOptions = {
          method: 'POST',
          ...options,
          headers: {
            // headers are case insensitive (https://stackoverflow.com/a/5259004)
            accept: '*/*'
          }
        };

        /////////////////////////////////////////////////////////////////
        // This part is added to support upload with apollo and absinthe
        /////////////////////////////////////////////////////////////////
        const files = extractFiles(body);
        if (files.length) {
          fetcherOptions.body = new FormData();
          files.forEach(({ path, file }) => {
            const pathArray = path.split('.');
            variables[pathArray[pathArray.length - 1]] = path;
            fetcherOptions.body.append(path, file);
          });
          fetcherOptions.body.append('operationName', operationName);
          fetcherOptions.body.append('variables', JSON.stringify(variables));
          fetcherOptions.body.append('query', print(query));
        } else {
          let serializedBody;
          try {
            serializedBody = JSON.stringify(body);
          } catch (e) {
            const parseError = new Error(`Network request failed. Payload is not serializable: ${e.message}`);
            parseError.parseError = e;
            throw parseError;
          }
          fetcherOptions.headers['content-type'] = 'application/json';
          fetcherOptions.body = serializedBody;
        }
        /////////////////////////////////////////////////////////////////
        // end
        /////////////////////////////////////////////////////////////////

        if (requestOptions.credentials) fetcherOptions.credentials = requestOptions.credentials;
        if (credentials) fetcherOptions.credentials = credentials;

        if (requestOptions.headers)
          fetcherOptions.headers = {
            ...fetcherOptions.headers,
            ...requestOptions.headers
          };
        if (headers) fetcherOptions.headers = { ...fetcherOptions.headers, ...headers };

        const { controller, signal } = createSignalIfSupported();
        if (controller) fetcherOptions.signal = signal;

        fetcher(contextURI || uri, fetcherOptions)
          // attach the raw response to the context for usage
          .then(response => {
            operation.setContext({ response });
            return response;
          })
          .then(parseAndCheckResponse(operation))
          .then(result => {
            // we have data and can send it to back up the link chain
            observer.next(result);
            observer.complete();
            return result;
          })
          .catch(err => {
            // fetch was cancelled so its already been cleaned up in the unsubscribe
            if (err.name === 'AbortError') return;
            observer.error(err);
          });

        return () => {
          // XXX support canceling this request
          // https://developers.google.com/web/updates/2017/09/abortable-fetch
          if (controller) controller.abort();
        };
      })
  );
};

export class HttpLink extends ApolloLink {
  constructor(opts) {
    super();
    this.requester = createHttpLink(opts).request;
  }

  request(op) {
    return this.requester(op);
  }
}
