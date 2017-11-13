import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import RecipeForm from 'containers/recipes/_RecipeForm';

import RECIPE_WITH_DEFAULT_VALUE from 'graphql/recipes/recipeWithDefaultValueQuery.graphql';
import CREATE_RECIPE from 'graphql/recipes/createRecipeMutation.graphql';
import RECIPES from 'graphql/recipes/recipesQuery.graphql';

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

const withRecipeWithDefaultValue = graphql(RECIPE_WITH_DEFAULT_VALUE);

const withCreateRecipe = graphql(CREATE_RECIPE, {
  props: ({ mutate }) => ({
    createRecipe(recipe) {
      return mutate({
        variables: { ...recipe },
        update: (store, { data: { createRecipe: { newRecipe } } }) => {
          if (!newRecipe) return false;
          const data = store.readQuery({ query: RECIPES });
          data.recipes.unshift(newRecipe);
          data.recipesCount += 1;
          store.writeQuery({ query: RECIPES, data });
        }
      });
    }
  })
});

export default withRecipeWithDefaultValue(withCreateRecipe(NewRecipe));
