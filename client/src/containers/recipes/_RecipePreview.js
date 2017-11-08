import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

import RecipeInfos from 'containers/recipes/_RecipeInfos';
import RecipeActions from 'containers/recipes/_RecipeActions';
import withCurrentUser from 'queries/currentUserQuery';

class RecipePreview extends Component {
  static propTypes = {
    recipe: PropTypes.object,
    currentUser: PropTypes.object
  };

  render() {
    const { recipe, currentUser } = this.props;

    return (
      <div className="recipe">
        <div className="title-wrapper">
          <h2 className="title is-4">
            <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
          </h2>
          {currentUser && currentUser.id === recipe.author.id ? <RecipeActions recipe={recipe} /> : null}
        </div>

        <RecipeInfos recipe={recipe} />
        <div className="recipe-begin">{recipe.description}</div>
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
      totalTime
      level
      budget
      author {
        id
        name
      }
    }
  `
};

export default withCurrentUser(RecipePreview);
