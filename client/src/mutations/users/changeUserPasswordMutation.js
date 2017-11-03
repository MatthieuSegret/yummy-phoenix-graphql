import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import formatErrors from 'utils/errorsUtils';
import withFlashMessage from 'components/withFlashMessage';

export default function(WrappedComponent) {
  const CHANGE_PASSWORD = gql`
    mutation changePassword($password: String, $passwordConfirmation: String, $currentPassword: String) {
      changePassword(
        password: $password
        password_confirmation: $passwordConfirmation
        current_password: $currentPassword
      ) {
        messages {
          field
          message
        }
      }
    }
  `;

  function onResult(response) {
    const errors = response.errors || formatErrors(response.data.changePassword.messages);
    if (!errors) {
      this.redirect('/', { notice: 'Votre mot de passe a bien été mis à jour' });
    } else {
      this.error('Des erreurs ont eu lieu, veuillez vérifier :');
    }
    return errors;
  }

  const withChangePassword = graphql(CHANGE_PASSWORD, {
    props: ({ ownProps, mutate }) => ({
      changePassword(user) {
        return mutate({
          variables: { ...user }
        })
          .then(onResult.bind(ownProps))
          .catch(error => {
            ownProps.error("Oups, nous sommes désolés, mais quelque chose s'est mal passé");
            return error;
          });
      }
    })
  });

  return withFlashMessage(withChangePassword(WrappedComponent));
}
