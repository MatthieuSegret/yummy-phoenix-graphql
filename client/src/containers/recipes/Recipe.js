import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import ReactMarkdown from 'react-markdown';
import * as moment from 'moment';
import 'moment/locale/fr';

import RecipeInfos from 'containers/recipes/_RecipeInfos';
import RecipeActions from 'containers/recipes/_RecipeActions';
import withRecipe from 'queries/recipes/recipeQuery';
import withCurrentUser from 'queries/users/currentUserQuery';

class Recipe extends Component {
  static propTypes = {
    data: PropTypes.object,
    currentUser: PropTypes.object
  };

  constructor(props) {
    super(props);
    moment.locale('fr');
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

          {currentUser && currentUser.id == recipe.author.id ? <RecipeActions recipe={recipe} /> : null}
          <RecipeInfos recipe={recipe} />

          <div className="recipe-info-second">
            <span className="recipe-author">Par {recipe.author.name}</span> -
            <span className="recipe-date"> {moment(new Date(recipe.inserted_at)).fromNow()}</span>
          </div>
          <hr />
        </div>

        <div className="content">
          <ReactMarkdown source={recipe.content} />
        </div>
        <Link to="/">Retour</Link>
      </div>
    );
  }
}

export const fragments = {
  recipe: gql`
    fragment RecipeFragment on Recipe {
      id
      title
      content
      totalTime
      level
      budget
      inserted_at
      author {
        id
        name
      }
    }
  `
};

export default withCurrentUser(withRecipe(Recipe));
