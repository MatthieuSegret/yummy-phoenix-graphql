import * as React from 'react';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';

import withFlashMessage from 'components/flash/withFlashMessage';

// graphql queries
import DELETE_RECIPE from 'graphql/recipes/deleteRecipeMutation.graphql';
import RECIPES from 'graphql/recipes/recipesQuery.graphql';

// typings
import { ApolloQueryResult } from 'apollo-client/core/types';
import { DataProxy } from 'apollo-cache';
import { RecipePreviewFragment, RecipesQuery, DeleteRecipeMutation, DeleteRecipeMutationVariables } from 'types';

interface IProps {
  recipe: RecipePreviewFragment;
  deleteRecipe: (id: string) => Promise<ApolloQueryResult<DeleteRecipeMutation>>;
  notice: (text: string) => void;
}

class RecipeActions extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.destroy = this.destroy.bind(this);
  }

  private destroy() {
    if (window.confirm('êtes vous sûre ?')) {
      this.props.deleteRecipe(this.props.recipe.id).then(response => {
        if (!response.data.deleteRecipe.errors) {
          this.props.notice('La recette a bien été supprimé.');
        }
      });
    }
    return false;
  }

  public render() {
    const { recipe } = this.props;

    return (
      <div className="recipe-actions is-pulled-right">
        <Link to={`/recipes/${recipe.id}/edit`} className="edit-recipe-link">
          <span className="icon">
            <i className="fa fa-edit" />
          </span>
        </Link>
        <a onClick={this.destroy} className="delete-recipe-link">
          <span className="icon">
            <i className="fa fa-trash-o" />
          </span>
        </a>
      </div>
    );
  }
}

const withDeleteRecipe = graphql<DeleteRecipeMutation, DeleteRecipeMutationVariables>(DELETE_RECIPE, {
  props: ({ mutate }) => ({
    deleteRecipe(recipeID: string) {
      return mutate!({
        variables: { id: recipeID },
        update: (store: DataProxy, { data: { deleteRecipe: { recipe: recipeDeleted } } }: any): void => {
          if (!recipeDeleted) return;
          const data = store.readQuery({ query: RECIPES }) as RecipesQuery;
          if (!data.recipes) return;
          data.recipes = data.recipes.filter(recipe => recipe.id !== recipeDeleted.id);
          data.recipesCount -= 1;
          store.writeQuery({ query: RECIPES, data });
        }
      });
    }
  })
});

export default compose(withDeleteRecipe, withFlashMessage)(RecipeActions);
