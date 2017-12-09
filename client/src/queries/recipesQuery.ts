import { graphql } from 'react-apollo';

import RECIPES from 'graphql/recipes/recipesQuery.graphql';

// typings
import { RecipesQuery, RecipesQueryVariables } from 'types';

export default graphql<RecipesQuery, RecipesQueryVariables>(RECIPES, {
  options: (ownProps: any) => ({
    variables: { keywords: ownProps.match.params.keywords }
  }),
  props: ({ data }) => {
    return {
      data,
      refetchRecipes: data && data.refetch,
      loadMoreRecipes() {
        return (
          data &&
          data.fetchMore({
            variables: { offset: data.recipes && data.recipes.length },
            updateQuery(state, { fetchMoreResult }) {
              const { recipes, recipesCount } = fetchMoreResult as RecipesQuery;
              if (!recipes) return false;
              return {
                recipes: [...state.recipes, ...recipes],
                recipesCount
              };
            }
          })
        );
      }
    };
  }
});
