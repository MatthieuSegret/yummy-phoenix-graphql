declare module '@absinthe/socket';
declare module '@absinthe/socket-apollo-link';
declare module 'phoenix';
declare module 'apollo-absinthe-upload-link';

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';

  const value: DocumentNode;
  export = value;
}
