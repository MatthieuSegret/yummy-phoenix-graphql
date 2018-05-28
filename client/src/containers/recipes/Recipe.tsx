import * as React from 'react';
import { graphql, compose } from 'react-apollo';
import ReactMarkdown from 'react-markdown';

import formatDate from 'utils/dateUtils';
import ROOT_URL from 'config/rootUrl';
import RecipeInfos from 'containers/recipes/_RecipeInfos';
import RecipeActions from 'containers/recipes/_RecipeActions';
import Comment from 'containers/comments/_Comment';
import NewComment from 'containers/comments/_NewComment';
import withCurrentUser from 'queries/currentUserQuery';

import RECIPE from 'graphql/recipes/recipeQuery.graphql';
import NEW_COMMENT_SUBSCRIPTION from 'graphql/recipes/newCommentSubscription.graphql';

// typings
import { ApolloQueryResult } from 'apollo-client/core/types';
import { RecipeQuery, User, RecipeFragment, CommentFragment } from 'types';

interface IProps {
  data: RecipeQuery;
  currentUser: User;
  match: any;
  subscribeToNewComment: (recipeId: number) => ApolloQueryResult<RecipeQuery>;
}

class Recipe extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.listComments = this.listComments.bind(this);
  }

  public componentWillMount() {
    this.props.subscribeToNewComment(this.props.match.params.id);
  }

  private listComments(recipe: RecipeFragment) {
    const { comments } = recipe;

    if (!comments || comments.length === 0) {
      return null;
    }

    return comments.map((comment: CommentFragment) => {
      return <Comment key={comment.id} comment={comment} />;
    });
  }

  public render() {
    const {
      data: { recipe },
      currentUser
    } = this.props;
    if (!recipe) {
      return null;
    }

    return (
      <div className="recipe-show recipe">
        <div className="title-wrapper">
          <h1 className="title is-3">{recipe.title}</h1>

          {currentUser && currentUser.id === recipe.author.id ? <RecipeActions recipe={recipe} /> : null}
          <RecipeInfos recipe={recipe} />

          <div className="recipe-info-second">
            <span className="recipe-author">Par {recipe.author.name}</span> -
            <span className="recipe-date"> {formatDate(recipe.inserted_at)}</span>
          </div>
          <hr />
        </div>

        <div className="content recipe-content">
          {recipe.image_url ? (
            <img src={`${ROOT_URL}${recipe.image_url}`} alt={recipe.title} className="recipe-image image" />
          ) : null}
          <ReactMarkdown source={recipe.content} />
        </div>

        <div className="comments">
          <h4 className="title is-5">Commentaires</h4>
          {this.listComments(recipe)}
          <NewComment recipeId={recipe.id} />
        </div>
      </div>
    );
  }
}

// Pending element has a temporary id. Unlike a classic id, it's not a number
function isPending(el: any): boolean {
  return isNaN(parseInt(el.id, 10));
}

function isSameComment(comment1: CommentFragment, comment2: CommentFragment): boolean {
  return comment1.body === comment2.body && comment1.author.id === comment2.author.id;
}

function isAlreadyPresent(comments: Array<CommentFragment>, newComment: CommentFragment): boolean {
  if (comments.find((c: CommentFragment) => c.id === newComment.id)) return true;
  // A new comment is created with optimistic UI.
  // The new comment is perhaps already present as pending comment with temporary id
  const pendingComment: CommentFragment | undefined = comments.find((c: CommentFragment) => isPending(c));
  if (pendingComment && isSameComment(pendingComment, newComment)) return true;
  return false;
}

const withRecipe = graphql(RECIPE, {
  options: (ownProps: any) => ({
    variables: {
      id: ownProps.match.params.id
    }
  }),
  props: ({ data }) => {
    return {
      data,
      subscribeToNewComment(recipeId: number) {
        return (
          data &&
          data.subscribeToMore({
            document: NEW_COMMENT_SUBSCRIPTION,
            variables: {
              recipeId
            },
            updateQuery(state: any, { subscriptionData }) {
              if (!subscriptionData.data || !subscriptionData.data.newComment) return false;
              const newComment: CommentFragment = subscriptionData.data.newComment as CommentFragment;
              // To prevent duplicates, we add an extra check to verify that we did not already add the comment to our store
              if (isAlreadyPresent(state.recipe.comments, newComment)) return false;

              return {
                recipe: {
                  ...state.recipe,
                  comments: [...state.recipe.comments, newComment]
                }
              };
            }
          })
        );
      }
    };
  }
});

export default compose(withCurrentUser, withRecipe)(Recipe);
