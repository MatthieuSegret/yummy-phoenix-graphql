import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RecipeForm from 'containers/recipes/_RecipeForm';
import withCreateRecipe from 'mutations/recipes/createRecipeMutation';

class NewRecipe extends Component {
  static propTypes = {
    createRecipe: PropTypes.func
  };

  render() {
    return (
      <div>
        <h1 className="title">Nouvelle recette</h1>
        <RecipeForm action={this.props.createRecipe} />
      </div>
    );
  }
}

export default withCreateRecipe(NewRecipe);
