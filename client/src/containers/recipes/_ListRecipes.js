import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

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
        {recipes.map(recipe => (
          <div key={recipe.id} className="recipe">
            <div className="title-wrapper">
              <h2 className="title is-4">
                <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
              </h2>
              <div className="recipe-actions is-pulled-right">
                <Link to={`/recipes/${recipe.id}/edit`}>Editer</Link>
              </div>
            </div>
            <div className="recipe-begin">{recipe.description}</div>
          </div>
        ))}

        {recipes && recipes.length < recipesCount ? (
          <button className="button load-more" onClick={loadMoreRecipes}>
            Plus de recettes
          </button>
        ) : null}
      </div>
    );
  }
}

export const fragments = {
  recipe: gql`
    fragment RecipePreviewFragment on Recipe {
      id
      title
      description
    }
  `
};
