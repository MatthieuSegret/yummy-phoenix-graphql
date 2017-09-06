import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RecipePreview from 'containers/recipes/_RecipePreview';

export default class ListRecipes extends Component {
  static propTypes = {
    recipes: PropTypes.array,
    recipesCount: PropTypes.number,
    loadMoreRecipes: PropTypes.func
  };

  render() {
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
