import * as React from 'react';
import { compose } from 'react-apollo';

import HeadListRecipes from 'containers/recipes/_HeadListRecipes';
import ListRecipes from 'containers/recipes/_ListRecipes';
import withRecipes from 'queries/recipesQuery';

// typings
import { ApolloQueryResult } from 'apollo-client/core/types';
import { RecipesQuery } from 'types';

interface IProps {
  data: RecipesQuery;
  match: any;
  loadMoreRecipes: () => ApolloQueryResult<RecipesQuery>;
}

class AllRecipes extends React.Component<IProps, {}> {
  public render() {
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

        <ListRecipes recipes={recipes} recipesCount={recipesCount} loadMoreRecipes={loadMoreRecipes} />
      </div>
    );
  }
}

export default compose(withRecipes)(AllRecipes);
