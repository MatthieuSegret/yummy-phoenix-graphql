import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import shortid from 'shortid';

import RenderField from 'components/form/RenderField';
import SubmitField from 'components/form/SubmitField';
import { recipeReducers as updateQueries } from 'reducers/recipesReducer';
import withCurrentUser from 'queries/currentUserQuery';

import CREATE_COMMENT from 'graphql/recipes/createCommentMutation.graphql';

class NewComment extends Component {
  static propTypes = {
    recipeId: PropTypes.string.isRequired,
    createComment: PropTypes.func,
    handleSubmit: PropTypes.func,
    reset: PropTypes.func,
    currentUser: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(values) {
    const { createComment, recipeId, reset } = this.props;
    this.setState({ loading: true });
    return createComment(recipeId, values).then(response => {
      const errors = response.data.createComment.errors;
      if (errors) {
        throw new SubmissionError(errors);
      } else {
        this.setState({ loading: false });
        reset();
      }
    });
  }

  render() {
    const { handleSubmit, currentUser } = this.props;
    const { loading } = this.state;

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
        <form onSubmit={handleSubmit(this.submitForm)}>
          <Field name="body" component={RenderField} type="textarea" rows={2} label="Nouveau commentaire" />
          <SubmitField loading={loading} cancel={false} value="Commenter" />
        </form>
      </div>
    );
  }
}

const withCreateComment = graphql(CREATE_COMMENT, {
  props: ({ ownProps, mutate }) => ({
    createComment(recipeId, comment) {
      return mutate({
        variables: { recipeId, ...comment },
        updateQueries,
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
      });
    }
  })
});

export default reduxForm({
  form: 'CommentForm'
})(withCurrentUser(withCreateComment(NewComment)));
