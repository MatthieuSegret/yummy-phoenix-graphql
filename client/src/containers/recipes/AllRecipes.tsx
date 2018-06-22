import * as React from 'react';

import HeadListRecipes from 'containers/recipes/_HeadListRecipes';
import ListRecipes from 'containers/recipes/_ListRecipes';

interface IProps {
  match: any;
}

export default class AllRecipes extends React.Component<IProps, {}> {
  public render() {
    const {
      params: { keywords }
    } = this.props.match;

    return (
      <div className="all-recipes">
        <h1 className="title is-3 has-text-centered">Les recettes de cuisine de vos amis</h1>
        <hr />
        <HeadListRecipes keywords={keywords} />
        <ListRecipes keywords={keywords} />
      </div>
    );
  }
}
