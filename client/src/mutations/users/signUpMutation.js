import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import updateQueries from 'reducers/usersReducer';

export default graphql(
  gql`
    mutation signUp($name: String, $email: String, $password: String, $passwordConfirmation: String) {
      signUp(name: $name, email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
        currentUser: result {
          name
          email
          token
        }
        messages {
          field
          message
        }
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      signUp(user) {
        return mutate({ variables: { ...user }, updateQueries });
      }
    })
  }
);
