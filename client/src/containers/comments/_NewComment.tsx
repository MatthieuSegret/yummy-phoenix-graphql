import * as React from 'react';
import { graphql, compose } from 'react-apollo';
import withMutationState from 'apollo-mutation-state';
import { Link } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import shortid from 'shortid';

import RenderField from 'components/form/RenderField';
import SubmitField from 'components/form/SubmitField';
import withCurrentUser from 'queries/currentUserQuery';
import withFlashMessage from 'components/flash/withFlashMessage';

import CREATE_COMMENT from 'graphql/recipes/createCommentMutation.graphql';
import RECIPE from 'graphql/recipes/recipeQuery.graphql';

// typings
import { ApolloQueryResult } from 'apollo-client/core/types';
import { DataProxy } from 'apollo-cache';
import {
  CreateCommentMutation,
  CreateCommentMutationVariables,
  RecipeQuery,
  User,
  MutationState,
  MutationStateProps
} from 'types';

interface IProps {
  recipeId: string;
  createComment: (
    recipeId: string,
    { body }: CreateCommentMutationVariables
  ) => Promise<ApolloQueryResult<CreateCommentMutation>>;
  handleSubmit: (event: any) => void;
  deleteFlashMessage: () => void;
  currentUser: User;
  mutation: MutationState;
}

class NewComment extends React.Component<IProps, {}> {
  private createCommentForm: Form;

  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }

  public async submitForm(values) {
    const { createComment, recipeId } = this.props;
    const { data: { createComment: { errors } } } = await createComment(recipeId, values);
    if (!errors) {
      this.props.deleteFlashMessage();
      this.createCommentForm.form.change('body', '');
    } else {
      return errors;
    }
  }

  public render() {
    const { mutation: { loading }, currentUser } = this.props;

    if (!currentUser) {
      return (
        <p>
          Vous devez vous <Link to="/users/signin">connecter</Link> ou vous <Link to="/users/signup">inscrire</Link>{' '}
          avant de continuer
        </p>
      );
    }

    return (
      <div className="new-comment">
        <Form
          onSubmit={this.submitForm}
          ref={input => {
            this.createCommentForm = input;
          }}
          render={({ handleSubmit, pristine }) => (
            <form onSubmit={handleSubmit}>
              <Field name="body" component={RenderField} type="textarea" rows={2} label="Nouveau commentaire" />
              <SubmitField loading={loading} cancel={false} disabled={pristine} value="Commenter" />
            </form>
          )}
        />
      </div>
    );
  }
}

type CurrentUserProps = {
  currentUser: User;
};

const withCreateComment = graphql<
  CreateCommentMutation,
  CreateCommentMutationVariables & MutationStateProps & CurrentUserProps
>(CREATE_COMMENT, {
  props: ({ ownProps, mutate }) => ({
    createComment(recipeId: string, comment: CreateCommentMutationVariables) {
      return ownProps.wrapMutate(
        mutate!({
          variables: { recipeId, ...comment },
          update: (store: DataProxy, { data: { createComment: { newComment } } }: any): void => {
            if (!newComment) return;
            const id = ownProps.recipeId;
            const data = store.readQuery({ query: RECIPE, variables: { id } }) as RecipeQuery;
            if (!data || !data.recipe) return;

            data.recipe.comments.unshift(newComment);
            store.writeQuery({ query: RECIPE, variables: { id }, data });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            createComment: {
              __typename: 'Recipe',
              newComment: {
                __typename: 'Comment',
                id: shortid.generate(),
                body: comment.body,
                inserted_at: +new Date(),
                pending: true,
                author: {
                  __typename: 'User',
                  name: ownProps.currentUser.name
                }
              },
              messages: null
            }
          }
        })
      );
    }
  })
});

export default compose(
  withCurrentUser,
  withMutationState({ wrapper: true, propagateError: true }),
  withCreateComment,
  withFlashMessage
)(NewComment);
