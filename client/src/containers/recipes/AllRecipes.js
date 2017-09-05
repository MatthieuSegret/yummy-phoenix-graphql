import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withRecipes from 'queries/recipes/recipesQuery';
import HeadListRecipes from 'containers/recipes/_HeadListRecipes';
import ListRecipes from 'containers/recipes/_ListRecipes';

class AllRecipes extends Component {
  static propTypes = {
    data: PropTypes.object,
    match: PropTypes.object
  };

  render() {
    const { data: { recipes, recipesCount }, loadMoreRecipes } = this.props;
    const { params: { keywords } } = this.props.match;

    if (!recipes) {
      return null;
    }

    return (
      <div className="all-recipes">
        <h1 className="title is-3 has-text-centered">Les recettes de cuisine de vos amis</h1>
        <hr />

        <HeadListRecipes keywords={keywords} />

        <ListRecipes
          recipes={recipes}
          recipesCount={recipesCount}
          loadMoreRecipes={loadMoreRecipes}
        />
      </div>
    );
  }
}

export default withRecipes(AllRecipes);
