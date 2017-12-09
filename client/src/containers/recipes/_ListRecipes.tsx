import * as React from 'react';

import RecipePreview from 'containers/recipes/_RecipePreview';

// typings
import { RecipesQuery, RecipePreviewFragment } from 'types';
import { ApolloQueryResult } from 'apollo-client/core/types';

interface IProps {
  recipes: Array<RecipePreviewFragment>;
  recipesCount: number;
  loadMoreRecipes: () => ApolloQueryResult<RecipesQuery>;
}

export default class ListRecipes extends React.Component<IProps, {}> {
  public render() {
    const { recipes, recipesCount, loadMoreRecipes } = this.props;

    if (!recipes) {
      return null;
    }

    return (
      <div className="recipes">
        {recipes.map(recipe => <RecipePreview key={recipe.id} recipe={recipe} />)}

        {recipes && recipes.length < recipesCount ? (
          <button className="button load-more" onClick={loadMoreRecipes}>
            Plus de recettes
          </button>
        ) : null}
      </div>
    );
  }
}
