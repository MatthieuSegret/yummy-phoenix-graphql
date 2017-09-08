import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class RecipeInfos extends Component {
  static propTypes = {
    recipe: PropTypes.object
  };

  render() {
    const { recipe } = this.props;

    return (
      <div className="recipe-info">
        <span className="recipe-total-time">{recipe.totalTime}</span> -&nbsp;
        <span className="recipe-level">{recipe.level}</span> -&nbsp;
        <span className="recipe-budget">{recipe.budget}</span>
      </div>
    );
  }
}
