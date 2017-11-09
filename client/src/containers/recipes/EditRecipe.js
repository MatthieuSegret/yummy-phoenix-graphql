import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import RecipeForm from 'containers/recipes/_RecipeForm';
import withFlashMessage from 'components/flash/withFlashMessage';

import RECIPE_FOR_EDITING from 'graphql/recipes/recipeForEditingQuery.graphql';
import UPDATE_RECIPE from 'graphql/recipes/updateRecipeMutation.graphql';

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

const withRecipeForEditing = graphql(RECIPE_FOR_EDITING, {
  options: ownProps => ({
    variables: {
      id: ownProps.match.params.id
    },
    fetchPolicy: 'network-only'
  })
});

const withUpdateRecipe = graphql(UPDATE_RECIPE, {
  props: ({ mutate }) => ({
    updateRecipe(recipe) {
      return mutate({ variables: { ...recipe } });
    }
  })
});

export default withRecipeForEditing(withUpdateRecipe(withFlashMessage(EditRecipe)));
