import * as React from 'react';
import { Mutation, MutationResult, compose } from 'react-apollo';
import { Link } from 'react-router-dom';

import withFlashMessage from 'components/flash/withFlashMessage';

// graphql queries
import DELETE_RECIPE from 'graphql/recipes/deleteRecipeMutation.graphql';
import RECIPES from 'graphql/recipes/recipesQuery.graphql';

// typings
import { DataProxy } from 'apollo-cache';
import { RecipePreviewFragment, RecipesData, DeleteRecipeData, DeleteRecipeVariables } from 'types';
class DeleteRecipeMutation extends Mutation<DeleteRecipeData, DeleteRecipeVariables> {}

interface IProps {
  recipe: RecipePreviewFragment;
  notice: (text: string) => void;
}

class RecipeActions extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.onDestroy = this.onDestroy.bind(this);
    this.updateCache = this.updateCache.bind(this);
  }

  private onDestroy(deleteRecipe: Function) {
    return async (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      if (window.confirm('êtes vous sûre ?')) {
        const recipeID: string = this.props.recipe.id;
        const response: MutationResult<DeleteRecipeData> = await deleteRecipe({ variables: { id: recipeID } });
        if (!response.data!.deleteRecipe.errors) {
          this.props.notice('La recette a bien été supprimé.');
        }
      }
      return false;
    };
  }

  private updateCache(cache: DataProxy, { data: { deleteRecipe } }: any) {
    const recipeDeleted = deleteRecipe.recipe;
    if (!recipeDeleted) return;
    const data = cache.readQuery({ query: RECIPES }) as RecipesData;
    if (!data.recipes) return;
    data.recipes = data.recipes.filter(recipe => recipe.id !== recipeDeleted.id);
    data.recipesCount -= 1;
    cache.writeQuery({ query: RECIPES, data });
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
        <DeleteRecipeMutation mutation={DELETE_RECIPE} update={this.updateCache}>
          {deleteRecipe => (
            <a onClick={this.onDestroy(deleteRecipe)} className="delete-recipe-link">
              <span className="icon">
                <i className="fa fa-trash-o" />
              </span>
            </a>
          )}
        </DeleteRecipeMutation>
      </div>
    );
  }
}

export default compose(withFlashMessage)(RecipeActions);
