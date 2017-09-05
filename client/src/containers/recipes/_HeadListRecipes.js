import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import SearchForm from 'containers/recipes/_SearchForm';

export default class HeadListRecipes extends Component {
  static propTypes = {
    keywords: PropTypes.string
  };

  render() {
    const { keywords } = this.props;

    return (
      <div className="columns">
        <div className="column">
          <div className="content">
            <SearchForm initialKeywords={keywords} />
          </div>
        </div>
        <div className="column">
          <Link to="/recipes/new" className="button is-primary is-pulled-right">
            Nouvelle Recette
          </Link>
        </div>
      </div>
    );
  }
}
