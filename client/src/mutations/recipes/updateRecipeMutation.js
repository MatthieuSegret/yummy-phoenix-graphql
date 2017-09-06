import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import normalizeMessages from 'helpers/errorHelpers';
import withFlashMessage from 'components/withFlashMessage';
import { fragments } from 'containers/recipes/EditRecipe';

export default function(WrappedComponent) {
  function onResult(response) {
    const errors = response.errors || normalizeMessages(response.data.updateRecipe.messages);
    if (!errors) {
      this.redirect('/', { notice: 'La recette a bien été éditée' });
    } else {
      this.error('Des erreurs ont eu lieu, veuillez vérifier :');
    }
    return errors;
  }

  const withUpdatePost = graphql(
    gql`
      mutation updateRecipe($id: ID, $title: String, $content: String) {
        updateRecipe(id: $id, title: $title, content: $content) {
          recipe: result {
            ...RecipeForEditingFragment
          }
          messages {
            field
            message
          }
        }
      }
      ${fragments.recipe}
    `,
    {
      props: ({ ownProps, mutate }) => ({
        updateRecipe(recipe) {
          return mutate({
            variables: { ...recipe }
          })
            .then(onResult.bind(ownProps))
            .catch(error => {
              ownProps.error("Oups, nous sommes désolés, mais quelque chose s'est mal passé");
            });
        }
      })
    }
  );

  return withFlashMessage(withUpdatePost(WrappedComponent));
}
