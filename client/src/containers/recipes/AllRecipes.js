import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { gql, graphql } from 'react-apollo';

class AllRecipes extends Component {
  static propTypes = {
    data: PropTypes.object
  };

  render() {
    const { data: { recipes } } = this.props;

    if (!recipes) {
      return null;
    }

    return (
      <div className="all-recipes">
        <h1 className="title is-3 has-text-centered">Les recettes de cuisine de vos amis</h1>
        <hr />

        <div className="recipes">
          {recipes.map(recipe => (
            <div key={recipe.id} className="recipe">
              <div className="title-wrapper">
                <h2 className="title is-4">
                  <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
                </h2>
              </div>
              <div className="recipe-begin">{recipe.description}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

let withRecipes = graphql(gql`
  query recipes {
    recipes {
      id
      title
      description
    }
  }
`);

export default withRecipes(AllRecipes);
