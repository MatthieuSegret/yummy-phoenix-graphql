import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { fragments as RecipePreviewFragments } from 'containers/recipes/_ListRecipes';
import normalizeMessages from 'helpers/errorHelpers';
import withFlashMessage from 'components/withFlashMessage';
import updateQueries from 'reducers/recipesReducer';

export default function(WrappedComponent) {
  function onResult(response) {
    const errors = response.errors || normalizeMessages(response.data.createRecipe.messages);
    if (!errors) {
      this.redirect('/', { notice: 'La recette a bien été créée.' });
    } else {
      this.error('Des erreurs ont eu lieu, veuillez vérifier :');
    }
    return errors;
  }

  const withCreateRecipe = graphql(
    gql`
      mutation createRecipe($title: String, $content: String) {
        createRecipe(title: $title, content: $content) {
          newRecipe: result {
            ...RecipePreviewFragment
          }
          messages {
            field
            message
          }
        }
      }
      ${RecipePreviewFragments.recipe}
    `,
    {
      props: ({ ownProps, mutate }) => ({
        createRecipe(recipe) {
          return mutate({
            variables: { ...recipe },
            updateQueries
          }).then(onResult.bind(ownProps));
        }
      })
    }
  );

  return withFlashMessage(withCreateRecipe(WrappedComponent));
}
