export default {
  recipes(state = [], { mutationResult, queryVariables }) {
    const { createRecipe } = mutationResult.data;

    if (createRecipe) {
      const newRecipe = createRecipe.newRecipe;
      if (!newRecipe) {
        return null;
      }
      return {
        recipes: [newRecipe, ...state.recipes],
        recipesCount: state.recipesCount + 1
      };
    }

    return state;
  }
};

export function updateQuery(state, { fetchMoreResult }) {
  const { recipes, recipesCount } = fetchMoreResult;
  return {
    recipes: [...state.recipes, ...recipes],
    recipesCount
  };
}
