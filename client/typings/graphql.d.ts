declare module '@absinthe/socket';
declare module '@absinthe/socket-apollo-link';
declare module 'phoenix';

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';

  const value: DocumentNode;
  export = value;
}
