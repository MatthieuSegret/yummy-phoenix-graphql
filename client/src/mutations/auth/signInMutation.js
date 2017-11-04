import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default graphql(
  gql`
    mutation signIn($email: String, $password: String) {
      signIn(email: $email, password: $password) {
        result {
          token
        }
        messages {
          message
        }
      }
    }
  `,
  {
    props: ({ mutate }) => ({
      signIn(user) {
        return mutate({ variables: { ...user } });
      }
    })
  }
);
