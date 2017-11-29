import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';

import withFlashMessage from 'components/flash/withFlashMessage';

import DELETE_RECIPE from 'graphql/recipes/deleteRecipeMutation.graphql';
import RECIPES from 'graphql/recipes/recipesQuery.graphql';

class RecipeActions extends Component {
  static propTypes = {
    recipe: PropTypes.object,
    deletePost: PropTypes.func,
    notice: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.destroy = this.destroy.bind(this);
  }

  destroy() {
    if (window.confirm('êtes vous sûre ?')) {
      this.props.deleteRecipe(this.props.recipe.id).then(response => {
        if (!response.data.deleteRecipe.errors) {
          this.props.notice('La recette a bien été supprimé.');
        }
      });
    }
    return false;
  }

  render() {
    const { recipe } = this.props;

    return (
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
    );
  }
}

const withDeleteRecipe = graphql(DELETE_RECIPE, {
  props: ({ mutate }) => ({
    deleteRecipe(recipeID) {
      return mutate({
        variables: { id: recipeID },
        update: (store, { data: { deleteRecipe: { recipe: recipeDeleted } } }) => {
          if (!recipeDeleted) return false;
          const data = store.readQuery({ query: RECIPES });
          data.recipes = data.recipes.filter(recipe => recipe.id !== recipeDeleted.id);
          data.recipesCount -= 1;
          store.writeQuery({ query: RECIPES, data });
        }
      });
    }
  })
});

export default withDeleteRecipe(withFlashMessage(RecipeActions));
