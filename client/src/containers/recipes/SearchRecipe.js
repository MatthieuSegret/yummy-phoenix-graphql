import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withRecipes from 'queries/recipes/recipesQuery';
import SearchForm from 'containers/recipes/_SearchForm';
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
    const { recipes } = this.props.data;
    const { params: { keywords } } = this.props.match;

    if (!recipes) {
      return null;
    }

    return (
      <div className="search-recipes">
        <h1 className="title is-3 has-text-centered">Recherche pour : {keywords}</h1>
        <hr />

        <div className="content">
          <SearchForm initialKeywords={keywords} />
        </div>

        {recipes && recipes.length === 0 ? (
          <h3>Pas de résultats ...</h3>
        ) : (
          <ListRecipes recipes={recipes} />
        )}
      </div>
    );
  }
}

export default withRecipes(SearchRecipes);
