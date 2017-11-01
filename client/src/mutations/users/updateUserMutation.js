import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import formatErrors from 'utils/errorsUtils';
import withFlashMessage from 'components/withFlashMessage';
import { fragments } from 'containers/users/EditUserProfile';

export default function(WrappedComponent) {
  const UPDATE_USER = gql`
    mutation updateUser($name: String, $email: String) {
      updateUser(name: $name, email: $email) {
        user: result {
          ...UserForEditingFragment
        }
        messages {
          field
          message
        }
      }
    }
    ${fragments.user}
  `;

  function onResult(response) {
    const errors = response.errors || formatErrors(response.data.updateUser.messages);
    if (!errors) {
      this.redirect('/', { notice: 'Votre profil a bien été mis à jour' });
    } else {
      this.error('Des erreurs ont eu lieu, veuillez vérifier :');
    }
    return errors;
  }

  const withUpdateUser = graphql(UPDATE_USER, {
    props: ({ ownProps, mutate }) => ({
      updateUser(user) {
        return mutate({
          variables: { ...user }
        })
          .then(onResult.bind(ownProps))
          .catch(error => {
            ownProps.error("Oups, nous sommes désolés, mais quelque chose s'est mal passé");
          });
      }
    })
  });

  return withFlashMessage(withUpdateUser(WrappedComponent));
}
