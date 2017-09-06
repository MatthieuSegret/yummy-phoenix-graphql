import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import RecipeForm from 'containers/recipes/_RecipeForm';
import withRecipeForEditing from 'queries/recipes/recipeForEditingQuery';

class EditRecipe extends Component {
  static propTypes = {
    createRecipe: PropTypes.func
  };

  render() {
    const { recipe } = this.props.data;
    if (!recipe) {
      return null;
    }

    return (
      <div>
        <h1 className="title">Editer la recette</h1>
        <RecipeForm action={this.props.createRecipe} initialValues={{ ...recipe }} />
      </div>
    );
  }
}

export const fragments = {
  recipe: gql`
    fragment RecipeForEditingFragment on Recipe {
      id
      title
      content
    }
  `
};

export default withRecipeForEditing(EditRecipe);
