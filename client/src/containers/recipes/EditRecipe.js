import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import RecipeForm from 'containers/recipes/_RecipeForm';
import withRecipeForEditing from 'queries/recipes/recipeForEditingQuery';
import withUpdateRecipe from 'mutations/recipes/updateRecipeMutation';
import withFlashMessage from 'components/withFlashMessage';

class EditRecipe extends Component {
  static propTypes = {
    updateRecipe: PropTypes.func,
    redirect: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.action = this.action.bind(this);
  }

  action(values) {
    return new Promise((resolve, reject) => {
      this.props.updateRecipe(values).then(response => {
        const errors = response.data.updateRecipe.errors;
        if (!errors) {
          this.props.redirect('/', { notice: 'La recette a bien été éditée.' });
        } else {
          reject(errors);
        }
      });
    });
  }

  render() {
    const { recipe } = this.props.data;
    if (!recipe) {
      return null;
    }

    return (
      <div>
        <h1 className="title">Editer la recette</h1>
        <RecipeForm action={this.action} initialValues={{ ...recipe }} />
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
      description
      totalTime
      level
      budget
    }
  `
};

export default withRecipeForEditing(withUpdateRecipe(withFlashMessage(EditRecipe)));
