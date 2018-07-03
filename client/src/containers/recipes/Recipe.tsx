import * as React from 'react';
import { Query, compose } from 'react-apollo';
import ReactMarkdown from 'react-markdown';

import formatDate from 'utils/dateUtils';
import RecipeInfos from 'containers/recipes/_RecipeInfos';
import RecipeActions from 'containers/recipes/_RecipeActions';

import CommentsList from 'containers/comments/_CommentsList';
import NewComment from 'containers/comments/_NewComment';
import withCurrentUser from 'queries/currentUserQuery';

import RECIPE from 'graphql/recipes/recipeQuery.graphql';

// typings
import { RecipeData, RecipeVariables, User } from 'types';
class RecipeQuery extends Query<RecipeData, RecipeVariables> {}

interface IProps {
  currentUser: User;
  match: any;
}

class Recipe extends React.Component<IProps, {}> {
  public render() {
    const { currentUser } = this.props;

    return (
      <RecipeQuery query={RECIPE} variables={{ id: this.props.match.params.id }}>
        {({ data, subscribeToMore }) => {
          if (!data || !data.recipe) return null;

          const recipe = data.recipe;
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
                  <img src={`${recipe.image_url}`} alt={recipe.title} className="recipe-image image" />
                ) : null}
                <ReactMarkdown source={recipe.content} />
              </div>

              <div className="comments">
                <h4 className="title is-5">Commentaires</h4>
                <CommentsList recipe={recipe} subscribeToMore={subscribeToMore} />
                <NewComment recipeId={recipe.id} />
              </div>
            </div>
          );
        }}
      </RecipeQuery>
    );
  }
}

export default compose(withCurrentUser)(Recipe);
