import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { fragments } from 'containers/recipes/EditRecipe';

export default function(WrappedComponent) {
  const withRecipeForEditing = graphql(
    gql`
      query recipe($id: ID) {
        recipe(id: $id) {
          ...RecipeForEditingFragment
        }
      }
      ${fragments.recipe}
    `,
    {
      options: ownProps => ({
        variables: {
          id: ownProps.match.params.id
        },
        fetchPolicy: 'network-only'
      })
    }
  );

  return withRecipeForEditing(WrappedComponent);
}
