import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
              <h2 className="title is-4">{recipe.title}</h2>
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
    }
  }
`);

export default withRecipes(AllRecipes);
