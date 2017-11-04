import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RecipeForm from 'containers/recipes/_RecipeForm';
import withRecipeWithDefaultValue from 'queries/recipes/recipeWithDefaultValueQuery';
import withCreateRecipe from 'mutations/recipes/createRecipeMutation';

class NewRecipe extends Component {
  static propTypes = {
    createRecipe: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.action = this.action.bind(this);
  }

  action(values) {
    return new Promise((resolve, reject) => {
      this.props.createRecipe(values).then(response => {
        const errors = response.data.createRecipe.errors;
        if (!errors) {
          this.props.redirect('/', { notice: 'La recette a bien été créée.' });
        } else {
          reject(errors);
        }
      });
    });
  }

  render() {
    const { recipeWithDefaultValue } = this.props.data;
    if (!recipeWithDefaultValue) {
      return null;
    }

    return (
      <div>
        <h1 className="title">Nouvelle recette</h1>
        <RecipeForm action={this.action} initialValues={{ ...recipeWithDefaultValue }} />
      </div>
    );
  }
}

export default withRecipeWithDefaultValue(withCreateRecipe(NewRecipe));
