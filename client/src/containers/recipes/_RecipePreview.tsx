import * as React from 'react';
import { compose } from 'react-apollo';
import { Link } from 'react-router-dom';

import ROOT_URL from 'config/rootUrl';
import RecipeInfos from 'containers/recipes/_RecipeInfos';
import RecipeActions from 'containers/recipes/_RecipeActions';
import withCurrentUser from 'queries/currentUserQuery';

// typings
import { RecipePreviewFragment, User } from 'types';

interface IProps {
  recipe: RecipePreviewFragment;
  currentUser: User;
}

class RecipePreview extends React.Component<IProps, {}> {
  public render() {
    const { recipe, currentUser } = this.props;

    return (
      <div className="recipe">
        <div className="recipe-image-wrapper">
          {recipe.image_url ? (
            <img src={`${ROOT_URL}${recipe.image_url}`} alt={recipe.title} className="recipe-image image is-96x96" />
          ) : null}
        </div>
        <div className="recipe-preview">
          <div className="title-wrapper">
            <h2 className="title is-4">
              <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
            </h2>
            {currentUser && currentUser.id === recipe.author.id ? <RecipeActions recipe={recipe} /> : null}
          </div>

          <RecipeInfos recipe={recipe} />
          <div className="recipe-begin">{recipe.description}</div>
        </div>
      </div>
    );
  }
}

export default compose(withCurrentUser)(RecipePreview);
