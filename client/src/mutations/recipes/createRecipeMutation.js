import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router';

import { fragments as RecipePreviewFragments } from 'containers/recipes/_ListRecipes';
import normalizeMessages from 'helpers/errorHelpers';
import updateQueries from 'reducers/recipesReducer';

export default function(WrappedComponent) {
  function onResult(response) {
    const errors = response.errors || normalizeMessages(response.data.createRecipe.messages);
    if (!errors) {
      this.history.push('/');
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

  return withCreateRecipe(withRouter(WrappedComponent));
}
