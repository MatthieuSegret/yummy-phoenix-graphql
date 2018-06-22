import * as React from 'react';
import { Query, Mutation, MutationResult, compose } from 'react-apollo';

import RecipeForm from 'containers/recipes/_RecipeForm';
import withFlashMessage from 'components/flash/withFlashMessage';

import RECIPE_FOR_EDITING from 'graphql/recipes/recipeForEditingQuery.graphql';
import UPDATE_RECIPE from 'graphql/recipes/updateRecipeMutation.graphql';

// typings
import {
  FlashMessageVariables,
  UpdateRecipeData,
  UpdateRecipeVariables,
  RecipeForEditingVariables,
  RecipeForEditingData
} from 'types';
class RecipeForEditingQuery extends Query<RecipeForEditingData, RecipeForEditingVariables> {}
class UpdateRecipeMutation extends Mutation<UpdateRecipeData, UpdateRecipeVariables> {}

interface IProps {
  redirect: (path: string, message?: FlashMessageVariables) => void;
  match: any;
}

class EditRecipe extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.action = this.action.bind(this);
  }

  private action(updateRecipe: Function): (values: any) => Promise<any> {
    return async (values: UpdateRecipeVariables) => {
      return new Promise(async (_, reject) => {
        const response: MutationResult<UpdateRecipeData> = await updateRecipe({ variables: values });
        const {
          updateRecipe: { errors }
        } = response.data!;
        if (!errors) {
          this.props.redirect('/', { notice: 'La recette a bien été éditée.' });
        } else {
          reject(errors);
        }
      });
    };
  }

  public render() {
    return (
      <RecipeForEditingQuery
        query={RECIPE_FOR_EDITING}
        variables={{ id: this.props.match.params.id }}
        fetchPolicy="network-only"
      >
        {({ data }) => {
          if (!data || !data.recipe) return null;
          const recipe = data.recipe;
          return (
            <UpdateRecipeMutation mutation={UPDATE_RECIPE}>
              {(updateRecipe, { loading }) => (
                <div>
                  <h1 className="title">Editer la recette</h1>
                  <RecipeForm action={this.action(updateRecipe)} initialValues={recipe} loading={loading} />
                </div>
              )}
            </UpdateRecipeMutation>
          );
        }}
      </RecipeForEditingQuery>
    );
  }
}

export default compose(withFlashMessage)(EditRecipe);
