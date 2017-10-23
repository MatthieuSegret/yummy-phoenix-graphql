import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import normalizeMessages from 'helpers/errorHelpers';
import withFlashMessage from 'components/withFlashMessage';
import updateQueries from 'reducers/usersReducer';

export default function(WrappedComponent) {
  function onResult(response) {
    return response.errors || normalizeMessages(response.data.signUp.messages);
  }

  const withSignUp = graphql(
    gql`
      mutation signUp($name: String, $email: String, $password: String, $password_confirmation: String) {
        signUp(
          input: { name: $name, email: $email, password: $password, password_confirmation: $password_confirmation }
        ) {
          currentUser: result {
            name
            email
          }
          messages {
            field
            message
          }
        }
      }
    `,
    {
      props: ({ ownProps, mutate }) => ({
        signUp(user) {
          return mutate({
            variables: { ...user },
            updateQueries
          })
            .then(onResult.bind(ownProps))
            .catch(error => {
              ownProps.error("Oups, nous sommes désolés, mais quelque chose s'est mal passé");
            });
        }
      })
    }
  );

  return withFlashMessage(withSignUp(WrappedComponent));
}
