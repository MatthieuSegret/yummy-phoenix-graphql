import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import formatErrors from 'utils/errorsUtils';
import withFlashMessage from 'components/withFlashMessage';
import { fetchCurrentUser } from 'queries/users/currentUserQuery';

export default function(WrappedComponent) {
  const fatalMessage = "Oups, nous sommes désolés, mais quelque chose s'est mal passé";

  function onResult(response) {
    const errors = response.errors || formatErrors(response.data.signIn.messages);
    if (errors) {
      window.localStorage.removeItem('yummy:token');
      this.error(errors.base || fatalMessage);
      return errors;
    }

    window.localStorage.setItem('yummy:token', response.data.signIn.result.token);
    fetchCurrentUser().then(() => {
      this.redirect('/', { notice: 'Vous êtes bien connecté(e)' });
    });
    return null;
  }

  const withSignIn = graphql(
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
      props: ({ ownProps, mutate }) => ({
        signIn(user) {
          return mutate({
            variables: { ...user }
          })
            .then(onResult.bind(ownProps))
            .catch(error => {
              ownProps.error(fatalMessage);
            });
        }
      })
    }
  );

  return withFlashMessage(withSignIn(WrappedComponent));
}
