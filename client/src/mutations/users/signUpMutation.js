import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import formatErrors from 'utils/errorsUtils';
import withFlashMessage from 'components/withFlashMessage';
import updateQueries from 'reducers/usersReducer';

export default function(WrappedComponent) {
  function onResult(response) {
    const errors = response.errors || formatErrors(response.data.signUp.messages);
    if (!errors) {
      window.localStorage.setItem('yummy:token', response.data.signUp.currentUser.token);
    }
    return errors;
  }

  const withSignUp = graphql(
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
