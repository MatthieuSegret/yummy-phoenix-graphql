import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withRecipes from 'queries/recipes/recipesQuery';
import HeadListRecipes from 'containers/recipes/_HeadListRecipes';
import ListRecipes from 'containers/recipes/_ListRecipes';

class SearchRecipes extends Component {
  static propTypes = {
    data: PropTypes.object,
    match: PropTypes.object
  };

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.match.params.keywords !== this.props.match.params.keywords) {
      this.props.data.recipes = [];
    }
  }

  render() {
    const { data: { recipes, recipesCount }, loadMoreRecipes } = this.props;
    const { params: { keywords } } = this.props.match;

    if (!recipes) {
      return null;
    }

    return (
      <div className="search-recipes">
        <h1 className="title is-3 has-text-centered">Recherche pour : {keywords}</h1>
        <hr />

        <HeadListRecipes keywords={keywords} />

        {recipes && recipes.length === 0 ? (
          <h3>Pas de résultats ...</h3>
        ) : (
          <ListRecipes
            recipes={recipes}
            recipesCount={recipesCount}
            loadMoreRecipes={loadMoreRecipes}
          />
        )}
      </div>
    );
  }
}

export default withRecipes(SearchRecipes);
