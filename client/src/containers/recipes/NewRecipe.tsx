import * as React from 'react';
import { Query, Mutation, MutationResult, compose } from 'react-apollo';

import RecipeForm from 'containers/recipes/_RecipeForm';
import withFlashMessage from 'components/flash/withFlashMessage';

import RECIPE_WITH_DEFAULT_VALUE from 'graphql/recipes/recipeWithDefaultValueQuery.graphql';
import CREATE_RECIPE from 'graphql/recipes/createRecipeMutation.graphql';
import RECIPES from 'graphql/recipes/recipesQuery.graphql';

// typings
import { DataProxy } from 'apollo-cache';
import {
  FlashMessageVariables,
  CreateRecipeData,
  CreateRecipeVariables,
  RecipesData,
  RecipeWithDefaultValueData
} from 'types';
class RecipeWithDefaultValueQuery extends Query<RecipeWithDefaultValueData> {}
class CreateRecipeMutation extends Mutation<CreateRecipeData, CreateRecipeVariables> {}

interface IProps {
  redirect: (path: string, message?: FlashMessageVariables) => void;
}

class NewRecipe extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.action = this.action.bind(this);
    this.updateCache = this.updateCache.bind(this);
  }

  private action(createRecipe: Function): (values: any) => Promise<any> {
    return async (values: CreateRecipeVariables) => {
      return new Promise(async (_, reject) => {
        const response: MutationResult<CreateRecipeData> = await createRecipe({ variables: values });
        const {
          createRecipe: { errors }
        } = response.data!;
        if (!errors) {
          this.props.redirect('/', { notice: 'La recette a bien été créée.' });
        } else {
          reject(errors);
        }
      });
    };
  }

  private updateCache(cache: DataProxy, { data: { createRecipe } }: any) {
    const newRecipe = createRecipe.newRecipe;
    if (!newRecipe) return;
    const data = cache.readQuery({ query: RECIPES }) as RecipesData;
    if (!data.recipes) return;
    data.recipes.unshift(newRecipe);
    data.recipesCount += 1;
    cache.writeQuery({ query: RECIPES, data });
  }

  public render() {
    return (
      <RecipeWithDefaultValueQuery query={RECIPE_WITH_DEFAULT_VALUE}>
        {({ data }) => {
          if (!data || !data.recipeWithDefaultValue) return null;
          const recipeWithDefaultValue = data.recipeWithDefaultValue;

          return (
            <CreateRecipeMutation mutation={CREATE_RECIPE} update={this.updateCache}>
              {(createRecipe, { loading }) => (
                <div>
                  <h1 className="title">Nouvelle recette</h1>
                  <RecipeForm
                    action={this.action(createRecipe)}
                    initialValues={recipeWithDefaultValue}
                    loading={loading}
                  />
                </div>
              )}
            </CreateRecipeMutation>
          );
        }}
      </RecipeWithDefaultValueQuery>
    );
  }
}

export default compose(withFlashMessage)(NewRecipe);
