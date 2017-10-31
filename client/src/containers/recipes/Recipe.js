import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { gql } from 'react-apollo';
import ReactMarkdown from 'react-markdown';

import RecipeInfos from 'containers/recipes/_RecipeInfos';
import RecipeActions from 'containers/recipes/_RecipeActions';
import withRecipe from 'queries/recipes/recipeQuery';
import withCurrentUser from 'queries/users/currentUserQuery';

class Recipe extends Component {
  static propTypes = {
    data: PropTypes.object,
    currentUser: PropTypes.object
  };

  render() {
    const { data: { recipe }, currentUser } = this.props;
    if (!recipe) {
      return null;
    }

    return (
      <div className="recipe-show recipe">
        <div className="title-wrapper">
          <h1 className="title is-3">{recipe.title}</h1>

          {currentUser ? <RecipeActions recipe={recipe} /> : null}
          <RecipeInfos recipe={recipe} />
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
      totalTime
      level
      budget
    }
  `
};

export default withCurrentUser(withRecipe(Recipe));
