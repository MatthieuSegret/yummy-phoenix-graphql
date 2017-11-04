import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default graphql(
  gql`
    mutation cancelAccount {
      cancelAccount
    }
  `,
  {
    props: ({ mutate }) => ({
      cancelAccount(user) {
        return mutate();
      }
    })
  }
);
