import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

import withDeleteRecipe from 'mutations/recipes/deleteRecipeMutation';

class RecipePreview extends Component {
  static propTypes = {
    recipe: PropTypes.object,
    deleteRecipe: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.destroy = this.destroy.bind(this);
  }

  destroy() {
    if (window.confirm('êtes vous sûre ?')) {
      this.props.deleteRecipe(this.props.recipe.id);
    }
    return false;
  }

  render() {
    const { recipe } = this.props;

    return (
      <div className="recipe">
        <div className="title-wrapper">
          <h2 className="title is-4">
            <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
          </h2>
          <div className="recipe-actions is-pulled-right">
            <Link to={`/recipes/${recipe.id}/edit`}>
              <span className="icon">
                <i className="fa fa-edit" />
              </span>
            </Link>
            <a onClick={this.destroy}>
              <span className="icon">
                <i className="fa fa-trash-o" />
              </span>
            </a>
          </div>
        </div>
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
    }
  `
};

export default withDeleteRecipe(RecipePreview);
