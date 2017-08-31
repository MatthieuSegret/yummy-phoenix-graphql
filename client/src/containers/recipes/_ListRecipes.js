import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class ListRecipes extends Component {
  static propTypes = {
    recipes: PropTypes.array
  };

  render() {
    const { recipes } = this.props;

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
            </div>
            <div className="recipe-begin">{recipe.description}</div>
          </div>
        ))}
      </div>
    );
  }
}
