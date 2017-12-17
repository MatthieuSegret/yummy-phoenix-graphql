import * as React from 'react';
import { graphql, compose } from 'react-apollo';
import withMutationState from 'apollo-mutation-state';

import RecipeForm from 'containers/recipes/_RecipeForm';
import withFlashMessage from 'components/flash/withFlashMessage';

import RECIPE_WITH_DEFAULT_VALUE from 'graphql/recipes/recipeWithDefaultValueQuery.graphql';
import CREATE_RECIPE from 'graphql/recipes/createRecipeMutation.graphql';
import RECIPES from 'graphql/recipes/recipesQuery.graphql';

// typings
import { ApolloQueryResult } from 'apollo-client/core/types';
import { DataProxy } from 'apollo-cache';
import {
  FlashMessageVariables,
  CreateRecipeMutation,
  CreateRecipeMutationVariables,
  RecipesQuery,
  RecipeWithDefaultValueQuery,
  RecipeFragment,
  MutationState,
  MutationStateProps
} from 'types';

interface IProps {
  redirect: (path: string, message: FlashMessageVariables) => void;
  createRecipe: ({  }: CreateRecipeMutationVariables) => Promise<ApolloQueryResult<CreateRecipeMutation>>;
  data: RecipeWithDefaultValueQuery;
  mutation: MutationState;
}

class NewRecipe extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.action = this.action.bind(this);
  }

  private async action(values: any) {
    return new Promise(async (_, reject) => {
      const { data: { createRecipe: { errors } } } = await this.props.createRecipe(values);
      if (!errors) {
        this.props.redirect('/', { notice: 'La recette a bien été créée.' });
      } else {
        reject(errors);
      }
    });
  }

  public render() {
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

const withRecipeWithDefaultValue = graphql<RecipeWithDefaultValueQuery>(RECIPE_WITH_DEFAULT_VALUE);

const withCreateRecipe = graphql<CreateRecipeMutation, CreateRecipeMutationVariables & MutationStateProps>(
  CREATE_RECIPE,
  {
    props: ({ mutate, ownProps: { wrapMutate } }) => ({
      createRecipe(recipe: RecipeFragment) {
        return wrapMutate(
          mutate!({
            variables: { ...recipe },
            update: (store: DataProxy, { data: { createRecipe: { newRecipe } } }: any): void => {
              if (!newRecipe) return;
              const data = store.readQuery({ query: RECIPES }) as RecipesQuery;
              if (!data.recipes) return;
              data.recipes.unshift(newRecipe);
              data.recipesCount += 1;
              store.writeQuery({ query: RECIPES, data });
            }
          })
        );
      }
    })
  }
);

export default compose(
  withRecipeWithDefaultValue,
  withMutationState({ wrapper: true, propagateError: true }),
  withCreateRecipe,
  withFlashMessage
)(NewRecipe);
