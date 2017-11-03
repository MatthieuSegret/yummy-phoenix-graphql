import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import withFlashMessage from 'components/withFlashMessage';

export default function(WrappedComponent) {
  const withChangePassword = graphql(
    gql`
      mutation cancelAccount {
        cancelAccount
      }
    `,
    {
      props: ({ ownProps, mutate }) => ({
        cancelAccount(user) {
          return mutate().catch(error => {
            ownProps.error("Oups, nous sommes désolés, mais quelque chose s'est mal passé");
            return { errors: error };
          });
        }
      })
    }
  );

  return withFlashMessage(withChangePassword(WrappedComponent));
}
