import { graphql } from 'react-apollo';

import RECIPES from 'graphql/recipes/recipesQuery.graphql';
import NEW_RECIPE_SUBSCRIPTION from 'graphql/recipes/newRecipeSubscription.graphql';

// typings
import { RecipesQuery, RecipesQueryVariables, RecipePreviewFragment } from 'types';

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
      },
      subscribeToNewRecipe() {
        return (
          data &&
          data.subscribeToMore({
            document: NEW_RECIPE_SUBSCRIPTION,
            updateQuery(state: any, { subscriptionData }) {
              if (!subscriptionData.data || !subscriptionData.data.newRecipe) return state;
              const newRecipe: RecipePreviewFragment = subscriptionData.data.newRecipe as RecipePreviewFragment;
              // To prevent duplicates, we add an extra check to verify that we did not already add the recipe to our store
              if (state.recipes.find((r: RecipePreviewFragment) => r.id === newRecipe.id)) return false;
              return {
                recipes: [newRecipe, ...state.recipes],
                recipesCount: state.recipesCount + 1
              };
            }
          })
        );
      }
    };
  }
});
