import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { gql, graphql } from 'react-apollo';

class Recipe extends Component {
  static propTypes = {
    data: PropTypes.object
  };

  render() {
    const { recipe } = this.props.data;
    if (!recipe) {
      return null;
    }

    return (
      <div className="recipe-show">
        <h1 className="title is-3">{recipe.title}</h1>

        <div className="content">{recipe.content}</div>
        <Link to="/">Retour</Link>
      </div>
    );
  }
}

let withRecipe = graphql(
  gql`
    query recipe($id: ID) {
      recipe(id: $id) {
        id
        title
        content
      }
    }
  `,
  {
    options: ownProps => ({
      variables: {
        id: ownProps.match.params.id
      }
    })
  }
);

export default withRecipe(Recipe);
