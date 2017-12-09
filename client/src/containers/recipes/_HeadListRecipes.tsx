import * as React from 'react';
import { compose } from 'react-apollo';
import { Link } from 'react-router-dom';

import SearchForm from 'containers/recipes/_SearchForm';
import withCurrentUser from 'queries/currentUserQuery';

// typings
import { User } from 'types';

interface IProps {
  keywords: string;
  currentUser: User;
}

class HeadListRecipes extends React.Component<IProps, {}> {
  public render() {
    const { keywords, currentUser } = this.props;

    return (
      <div className="columns">
        <div className="column">
          <div className="content">
            <SearchForm initialKeywords={keywords} />
          </div>
        </div>
        {currentUser ? (
          <div className="column">
            <Link to="/recipes/new" className="button is-primary is-pulled-right">
              Nouvelle Recette
            </Link>
          </div>
        ) : null}
      </div>
    );
  }
}

export default compose(withCurrentUser)(HeadListRecipes);
