import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withMutationState from 'apollo-mutation-state';

import RecipeForm from 'containers/recipes/_RecipeForm';
import withFlashMessage from 'components/flash/withFlashMessage';

import RECIPE_WITH_DEFAULT_VALUE from 'graphql/recipes/recipeWithDefaultValueQuery.graphql';
import CREATE_RECIPE from 'graphql/recipes/createRecipeMutation.graphql';
import RECIPES from 'graphql/recipes/recipesQuery.graphql';

class NewRecipe extends Component {
  static propTypes = {
    createRecipe: PropTypes.func,
    redirect: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.action = this.action.bind(this);
  }

  async action(values) {
    return new Promise(async (resolve, reject) => {
      const { data: { createRecipe: { errors } } } = await this.props.createRecipe(values);
      if (!errors) {
        this.props.redirect('/', { notice: 'La recette a bien été créée.' });
      } else {
        reject(errors);
      }
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
        <RecipeForm action={this.action} initialValues={{ ...recipeWithDefaultValue }} mutation={this.props.mutation} />
      </div>
    );
  }
}

const withRecipeWithDefaultValue = graphql(RECIPE_WITH_DEFAULT_VALUE);

const withCreateRecipe = graphql(CREATE_RECIPE, {
  props: ({ mutate, ownProps: { wrapMutate } }) => ({
    createRecipe(recipe) {
      return wrapMutate(
        mutate({
          variables: { ...recipe },
          update: (store, { data: { createRecipe: { newRecipe } } }) => {
            if (!newRecipe) return false;
            const data = store.readQuery({ query: RECIPES });
            data.recipes.unshift(newRecipe);
            data.recipesCount += 1;
            store.writeQuery({ query: RECIPES, data });
          }
        })
      );
    }
  })
});

export default compose(
  withRecipeWithDefaultValue,
  withMutationState({ wrapper: true, propagateError: true }),
  withCreateRecipe,
  withFlashMessage
)(NewRecipe);
