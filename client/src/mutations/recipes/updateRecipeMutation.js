import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import formatErrors from 'utils/errorsUtils';
import withFlashMessage from 'components/withFlashMessage';
import { fragments } from 'containers/recipes/EditRecipe';

export default function(WrappedComponent) {
  function onResult(response) {
    const errors = response.errors || formatErrors(response.data.updateRecipe.messages);
    if (!errors) {
      this.redirect('/', { notice: 'La recette a bien été éditée' });
    } else {
      this.error('Des erreurs ont eu lieu, veuillez vérifier :');
    }
    return errors;
  }

  const withUpdatePost = graphql(
    gql`
      mutation updateRecipe($id: ID, $title: String, $content: String, $totalTime: String, $level: String, $budget: String) {
        updateRecipe(id: $id, input: {title: $title, content: $content, totalTime: $totalTime, level: $level, budget: $budget}) {
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
              return error;
            });
        }
      })
    }
  );

  return withFlashMessage(withUpdatePost(WrappedComponent));
}
