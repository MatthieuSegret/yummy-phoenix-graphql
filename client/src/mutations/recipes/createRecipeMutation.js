import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { fragments as RecipePreviewFragments } from 'containers/recipes/_RecipePreview';
import updateQueries from 'reducers/recipesReducer';

export default function(WrappedComponent) {
  const withCreateRecipe = graphql(
    gql`
      mutation createRecipe($title: String, $content: String, $totalTime: String, $level: String, $budget: String) {
        createRecipe(input: {title: $title, content: $content, totalTime: $totalTime, level: $level, budget: $budget}) {
          newRecipe: result {
            ...RecipePreviewFragment
          }
          messages {
            field
            message
          }
        }
      }
      ${RecipePreviewFragments.recipe}
    `,
    {
      props: ({ mutate }) => ({
        createRecipe(recipe) {
          return mutate({ variables: { ...recipe }, updateQueries });
        }
      })
    }
  );

  return withCreateRecipe(WrappedComponent);
}
