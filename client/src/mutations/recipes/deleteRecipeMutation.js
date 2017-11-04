import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import updateQueries from 'reducers/recipesReducer';

export default graphql(
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
        return mutate({ variables: { id: recipeID }, updateQueries });
      }
    })
  }
);
