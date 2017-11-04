import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default graphql(
  gql`
    mutation revokeToken {
      revokeToken
    }
  `,
  {
    props: ({ mutate }) => ({
      revokeToken() {
        return mutate();
      }
    })
  }
);
