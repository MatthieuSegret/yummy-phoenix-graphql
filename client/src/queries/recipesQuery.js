import { graphql } from 'react-apollo';

import RECIPES from 'graphql/recipes/recipesQuery.graphql';

export default graphql(RECIPES, {
  options: ownProps => ({
    variables: { keywords: ownProps.match.params.keywords }
  }),
  props: ({ data }) => {
    return {
      data,
      refetchRecipes: data.refetch,
      loadMoreRecipes() {
        return data.fetchMore({
          variables: { offset: data.recipes.length },
          updateQuery(state, { fetchMoreResult }) {
            const { recipes, recipesCount } = fetchMoreResult;
            return {
              recipes: [...state.recipes, ...recipes],
              recipesCount
            };
          }
        });
      }
    };
  }
});
