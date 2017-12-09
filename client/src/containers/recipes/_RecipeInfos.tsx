import * as React from 'react';

// typings
import { RecipePreviewFragment } from 'types';

interface IProps {
  recipe: RecipePreviewFragment;
}

export default class RecipeInfos extends React.Component<IProps, {}> {
  public render() {
    const { recipe } = this.props;

    return (
      <div className="recipe-info">
        <span className="recipe-total-time">{recipe.totalTime}</span> -&nbsp;
        <span className="recipe-level">{recipe.level}</span> -&nbsp;
        <span className="recipe-budget">{recipe.budget}</span>
      </div>
    );
  }
}
