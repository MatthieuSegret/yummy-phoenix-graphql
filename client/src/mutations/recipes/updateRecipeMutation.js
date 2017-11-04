import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { fragments } from 'containers/recipes/EditRecipe';

export default function(WrappedComponent) {
  const withUpdatePost = graphql(
    gql`
      mutation updateRecipe($id: ID, $title: String, $content: String, $totalTime: String, $level: String, $budget: String) {
        updateRecipe(id: $id, input: {title: $title, content: $content, totalTime: $totalTime, level: $level, budget: $budget}) {
          recipe: result {
            ...RecipeForEditingFragment
          }
          messages {
            field
            message
          }
        }
      }
      ${fragments.recipe}
    `,
    {
      props: ({ mutate }) => ({
        updateRecipe(recipe) {
          return mutate({ variables: { ...recipe } });
        }
      })
    }
  );

  return withUpdatePost(WrappedComponent);
}
