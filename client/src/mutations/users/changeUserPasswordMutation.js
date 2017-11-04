import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default graphql(
  gql`
    mutation changePassword($password: String, $passwordConfirmation: String, $currentPassword: String) {
      changePassword(
        password: $password
        password_confirmation: $passwordConfirmation
        current_password: $currentPassword
      ) {
        messages {
          field
          message
        }
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      changePassword(user) {
        return mutate({ variables: { ...user } });
      }
    })
  }
);
