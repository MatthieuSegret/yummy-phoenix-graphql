import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import normalizeMessages from 'helpers/errorHelpers';
import withFlashMessage from 'components/withFlashMessage';
import updateQueries from 'reducers/recipesReducer';

export default function(WrappedComponent) {
  function onResult(response) {
    const errors = response.errors || normalizeMessages(response.data.deleteRecipe.messages);
    if (!errors) {
      this.notice('La recette a bien été supprimé.');
    }
  }

  const withDeleteRecipe = graphql(
    gql`
      mutation deleteRecipe($id: ID) {
        deleteRecipe(id: $id) {
          recipe: result {
            id
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
        deleteRecipe(recipeID) {
          return mutate({
            variables: { id: recipeID },
            updateQueries
          }).then(onResult.bind(ownProps));
        }
      })
    }
  );

  return withFlashMessage(withDeleteRecipe(WrappedComponent));
}
