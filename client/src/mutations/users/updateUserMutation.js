import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { fragments } from 'containers/users/EditUserProfile';

export default function(WrappedComponent) {
  const withUpdateUser = graphql(
    gql`
      mutation updateUser($name: String, $email: String) {
        updateUser(name: $name, email: $email) {
          user: result {
            ...UserForEditingFragment
          }
          messages {
            field
            message
          }
        }
      }
      ${fragments.user}
  `,
    {
      props: ({ mutate }) => ({
        updateUser(user) {
          return mutate({ variables: { ...user } });
        }
      })
    }
  );

  return withUpdateUser(WrappedComponent);
}
