import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import normalizeMessages from 'helpers/errorHelpers';
import withFlashMessage from 'components/withFlashMessage';
import { fetchCurrentUser } from 'queries/users/currentUserQuery';

export default function(WrappedComponent) {
  const fatalMessage = "Oups, nous sommes désolés, mais quelque chose s'est mal passé";

  function onResult(response) {
    const errors = response.errors || normalizeMessages(response.data.login.messages);
    const payload = response.data.login.payload;

    if (!errors && payload && payload.token) {
      window.localStorage.setItem('yummy:token', payload.token);
      fetchCurrentUser().then(() => {
        this.redirect('/', { notice: 'Vous êtes bien connecté(e)' });
      });
    } else if (errors.base) {
      this.error(errors.base);
    } else {
      this.error(fatalMessage);
    }
    return errors;
  }

  const withSignIn = graphql(
    gql`
      mutation login($email: String!, $password: String!) {
        login(input: { email: $email, password: $password }) {
          payload: result {
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
