import * as React from 'react';

import HeadListRecipes from 'containers/recipes/_HeadListRecipes';
import ListRecipes from 'containers/recipes/_ListRecipes';

interface IProps {
  match: any;
}

export default class SearchRecipes extends React.Component<IProps, {}> {
  public render() {
    const {
      params: { keywords }
    } = this.props.match;

    return (
      <div className="search-recipes">
        <h1 className="title is-3 has-text-centered">Recherche pour : {keywords}</h1>
        <hr />
        <HeadListRecipes keywords={keywords} />
        <ListRecipes keywords={keywords} />
      </div>
    );
  }
}
