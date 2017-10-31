import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import formatErrors from 'utils/errorsUtils';
import withFlashMessage from 'components/withFlashMessage';

export default function(WrappedComponent) {
  function onResult(response) {
    const errors = response.errors || formatErrors(response.data.revokeToken.messages);
    if (errors && errors.base) {
      this.error(errors.base);
    }
    return errors;
  }

  const withRevokeToken = graphql(
    gql`
      mutation revokeToken {
        revokeToken
      }
    `,
    {
      props: ({ ownProps, mutate }) => ({
        revokeToken() {
          return mutate()
            .then(onResult.bind(ownProps))
            .catch(error => {
              ownProps.error("Oups, nous sommes désolés, mais quelque chose s'est mal passé");
            });
        }
      })
    }
  );

  return withFlashMessage(withRevokeToken(WrappedComponent));
}
