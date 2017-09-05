import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { gql } from 'react-apollo';
import ReactMarkdown from 'react-markdown';

import withRecipe from 'queries/recipes/recipeQuery';

class Recipe extends Component {
  static propTypes = {
    data: PropTypes.object
  };

  render() {
    const { recipe } = this.props.data;
    if (!recipe) {
      return null;
    }

    return (
      <div className="recipe-show">
        <div className="title-wrapper">
          <h1 className="title is-3">{recipe.title}</h1>
          <hr />
        </div>

        <div className="content">
          <ReactMarkdown source={recipe.content} />
        </div>
        <Link to="/">Retour</Link>
      </div>
    );
  }
}

export const fragments = {
  recipe: gql`
    fragment RecipeFragment on Recipe {
      id
      title
      content
    }
  `
};

export default withRecipe(Recipe);
