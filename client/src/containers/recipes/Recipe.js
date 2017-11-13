import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';

import ROOT_URL from 'config/rootUrl';
import RecipeInfos from 'containers/recipes/_RecipeInfos';
import RecipeActions from 'containers/recipes/_RecipeActions';
import Comment from 'containers/comments/_Comment';
import NewComment from 'containers/comments/_NewComment';
import withCurrentUser from 'queries/currentUserQuery';

import RECIPE from 'graphql/recipes/recipeQuery.graphql';

class Recipe extends Component {
  static propTypes = {
    data: PropTypes.object,
    currentUser: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.listComments = this.listComments.bind(this);
  }

  listComments() {
    const { comments } = this.props.data.recipe;

    if (!comments || comments.length === 0) {
      return null;
    }

    return comments.map(comment => {
      return <Comment key={comment.id} comment={comment} />;
    });
  }

  render() {
    const { data: { recipe }, currentUser } = this.props;
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
            <span className="recipe-date"> {moment(new Date(recipe.inserted_at)).fromNow()}</span>
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
          {this.listComments()}
          <NewComment recipeId={recipe.id} />
        </div>
      </div>
    );
  }
}

const withRecipe = graphql(RECIPE, {
  options: ownProps => ({
    variables: {
      id: ownProps.match.params.id
    }
  })
});

export default withCurrentUser(withRecipe(Recipe));
