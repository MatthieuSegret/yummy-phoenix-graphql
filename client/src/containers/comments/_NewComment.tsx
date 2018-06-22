import * as React from 'react';
import { Mutation, MutationResult, compose } from 'react-apollo';
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
import { DataProxy } from 'apollo-cache';
import { CommentFragment, CreateCommentVariables, CreateCommentData, RecipeData, User } from 'types';
class CreateCommentMutation extends Mutation<CreateCommentData, CreateCommentVariables> {}

interface IProps {
  recipeId: string;
  deleteFlashMessage: () => void;
  currentUser: User;
}

interface IStates {
  body: string;
}

class NewComment extends React.Component<IProps, IStates> {
  private createCommentForm: any;

  constructor(props: IProps) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.updateCache = this.updateCache.bind(this);
  }

  private submitForm(createComment: Function) {
    return async (values: CreateCommentVariables) => {
      const { recipeId, currentUser } = this.props;
      const response: MutationResult<CreateCommentData> = await createComment({
        variables: { ...values, recipeId },
        optimisticResponse: {
          __typename: 'Mutation',
          createComment: {
            __typename: 'Recipe',
            newComment: {
              __typename: 'Comment',
              id: shortid.generate(),
              body: values.body,
              inserted_at: +new Date(),
              pending: true,
              author: {
                __typename: 'User',
                id: currentUser.id,
                name: currentUser.name
              }
            },
            messages: null
          }
        }
      });
      const {
        createComment: { errors }
      } = response.data!;

      if (!errors) {
        this.props.deleteFlashMessage();
        this.createCommentForm.form.change('body', '');
      } else {
        return errors;
      }
    };
  }

  private updateCache(cache: DataProxy, { data: { createComment } }: any) {
    const newComment = createComment.newComment;
    if (!newComment) return;
    const id = this.props.recipeId;
    const data = cache.readQuery({ query: RECIPE, variables: { id } }) as RecipeData;
    if (!data || !data.recipe) return;
    // To prevent duplicates, we add an extra check to verify that we did not already add the comment to our store
    // because when we create a new comment we might be notified of creation through the subscription before the query returns data
    if (data.recipe.comments.find((c: CommentFragment) => c.id === newComment.id)) return;

    data.recipe.comments.push(newComment);
    cache.writeQuery({ query: RECIPE, variables: { id }, data });
  }

  public render() {
    const { currentUser } = this.props;

    if (!currentUser) {
      return (
        <p>
          Vous devez vous <Link to="/users/signin">connecter</Link> ou vous <Link to="/users/signup">inscrire</Link>{' '}
          avant de continuer
        </p>
      );
    }

    return (
      <CreateCommentMutation mutation={CREATE_COMMENT} update={this.updateCache}>
        {(createComment, { loading }) => (
          <div className="new-comment">
            <Form
              onSubmit={this.submitForm(createComment)}
              ref={(input: any) => {
                this.createCommentForm = input;
              }}
              render={({ handleSubmit, pristine }: any) => (
                <form onSubmit={handleSubmit}>
                  <Field name="body" component={RenderField} type="textarea" rows={2} label="Nouveau commentaire" />
                  <SubmitField loading={loading} cancel={false} disabled={pristine} value="Commenter" />
                </form>
              )}
            />
          </div>
        )}
      </CreateCommentMutation>
    );
  }
}

export default compose(
  withCurrentUser,
  withFlashMessage
)(NewComment);
