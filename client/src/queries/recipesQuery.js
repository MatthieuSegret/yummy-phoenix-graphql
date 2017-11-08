import { graphql } from 'react-apollo';

import { updateQuery } from 'reducers/recipesReducer';
import RECIPES from 'graphql/recipes/recipesQuery.graphql';

export default graphql(RECIPES, {
  options: ownProps => ({
    variables: { offset: 0, keywords: ownProps.match.params.keywords }
  }),
  props: ({ data }) => {
    return {
      data,
      refetchRecipes: data.refetch,
      loadMoreRecipes() {
        return data.fetchMore({
          variables: { offset: data.recipes.length },
          updateQuery
        });
      }
    };
  }
});
