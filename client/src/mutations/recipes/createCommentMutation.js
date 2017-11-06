import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import shortid from 'shortid';

import { fragments as CommentFragments } from 'containers/comments/_Comment';
import { recipeReducers as updateQueries } from 'reducers/recipesReducer';

export default function(WrappedComponent) {
  const withCreateComment = graphql(
    gql`
      mutation createComment($recipeId: ID, $body: String) {
        createComment(recipeId: $recipeId, body: $body) {
          newComment: result {
            ...CommentFragment
          }
          messages {
            field
            message
          }
        }
      }
      ${CommentFragments.comment}
    `,
    {
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
    }
  );

  return withCreateComment(WrappedComponent);
}
