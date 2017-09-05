import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { fragments as RecipeFragments } from 'containers/recipes/Recipe';

export default function(WrappedComponent) {
  const withPost = graphql(
    gql`
      query recipe($id: ID) {
        recipe(id: $id) {
          ...RecipeFragment
        }
      }
    ${RecipeFragments.recipe}
    `,
    {
      options: ownProps => ({
        variables: {
          id: ownProps.match.params.id
        }
      })
    }
  );

  return withPost(WrappedComponent);
}
