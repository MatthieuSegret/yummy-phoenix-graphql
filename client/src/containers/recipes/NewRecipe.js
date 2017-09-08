import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RecipeForm from 'containers/recipes/_RecipeForm';
import withRecipeWithDefaultValue from 'queries/recipes/recipeWithDefaultValueQuery';
import withCreateRecipe from 'mutations/recipes/createRecipeMutation';

class NewRecipe extends Component {
  static propTypes = {
    createRecipe: PropTypes.func
  };

  render() {
    const { recipeWithDefaultValue } = this.props.data;
    if (!recipeWithDefaultValue) {
      return null;
    }

    return (
      <div>
        <h1 className="title">Nouvelle recette</h1>
        <RecipeForm action={this.props.createRecipe} initialValues={{ ...recipeWithDefaultValue }} />
      </div>
    );
  }
}

export default withRecipeWithDefaultValue(withCreateRecipe(NewRecipe));
