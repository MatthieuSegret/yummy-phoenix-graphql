import * as React from 'react';
import { Query } from 'react-apollo';

import RecipePreview from 'containers/recipes/_RecipePreview';
import RECIPES from 'graphql/recipes/recipesQuery.graphql';

// typings
import { RecipesData, RecipesVariables } from 'types';
class RecipesQuery extends Query<RecipesData, RecipesVariables> {}

interface IProps {
  keywords: string;
}

export default class ListRecipes extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.loadMoreRecipes = this.loadMoreRecipes.bind(this);
  }

  private loadMoreRecipes(data: RecipesData, fetchMore: Function) {
    return async (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      fetchMore({
        variables: { offset: data.recipes && data.recipes.length },
        updateQuery(state: any, { fetchMoreResult }: { fetchMoreResult: RecipesData }) {
          const { recipes, recipesCount } = fetchMoreResult;
          if (!recipes) return false;
          return {
            recipes: [...state.recipes, ...recipes],
            recipesCount
          };
        }
      });
    };
  }

  public render() {
    return (
      <RecipesQuery query={RECIPES} variables={{ keywords: this.props.keywords }}>
        {({ data, fetchMore }) => {
          if (!data || !data.recipes) return null;
          const { recipes, recipesCount } = data;
          if (recipes.length === 0) return <h3>Pas de résultats ...</h3>;

          return (
            <div className="recipes">
              {recipes.map(recipe => <RecipePreview key={recipe.id} recipe={recipe} />)}

              {recipes && recipes.length < recipesCount ? (
                <button className="button load-more" onClick={this.loadMoreRecipes(data, fetchMore)}>
                  Plus de recettes
                </button>
              ) : null}
            </div>
          );
        }}
      </RecipesQuery>
    );
  }
}
