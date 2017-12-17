import * as React from 'react';
import { graphql, compose } from 'react-apollo';
import withMutationState from 'apollo-mutation-state';

import RecipeForm from 'containers/recipes/_RecipeForm';
import withFlashMessage from 'components/flash/withFlashMessage';

import RECIPE_FOR_EDITING from 'graphql/recipes/recipeForEditingQuery.graphql';
import UPDATE_RECIPE from 'graphql/recipes/updateRecipeMutation.graphql';

// typings
import { ApolloQueryResult } from 'apollo-client/core/types';
import {
  FlashMessageVariables,
  UpdateRecipeMutation,
  UpdateRecipeMutationVariables,
  RecipeForEditingQuery,
  RecipeFragment,
  MutationState,
  MutationStateProps
} from 'types';

interface IProps {
  redirect: (path: string, message: FlashMessageVariables) => void;
  updateRecipe: ({  }: UpdateRecipeMutationVariables) => Promise<ApolloQueryResult<UpdateRecipeMutation>>;
  data: RecipeForEditingQuery;
  mutation: MutationState;
}

class EditRecipe extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.action = this.action.bind(this);
  }

  private action(values: any) {
    return new Promise(async (_, reject) => {
      const { data: { updateRecipe: { errors } } } = await this.props.updateRecipe(values);
      if (!errors) {
        this.props.redirect('/', { notice: 'La recette a bien été éditée.' });
      } else {
        reject(errors);
      }
    });
  }

  public render() {
    const { recipe } = this.props.data;
    if (!recipe) {
      return null;
    }

    return (
      <div>
        <h1 className="title">Editer la recette</h1>
        <RecipeForm action={this.action} initialValues={{ ...recipe }} mutation={this.props.mutation} />
      </div>
    );
  }
}

const withRecipeForEditing = graphql(RECIPE_FOR_EDITING, {
  options: (ownProps: any) => ({
    variables: {
      id: ownProps.match.params.id
    },
    fetchPolicy: 'network-only'
  })
});

const withUpdateRecipe = graphql<UpdateRecipeMutation, UpdateRecipeMutationVariables & MutationStateProps>(
  UPDATE_RECIPE,
  {
    props: ({ mutate, ownProps: { wrapMutate } }) => ({
      updateRecipe(recipe: RecipeFragment) {
        return wrapMutate(mutate!({ variables: { ...recipe } }));
      }
    })
  }
);

export default compose(
  withRecipeForEditing,
  withMutationState({ wrapper: true, propagateError: true }),
  withUpdateRecipe,
  withFlashMessage
)(EditRecipe);
