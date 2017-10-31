import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { fragments as RecipePreviewFragments } from 'containers/recipes/_RecipePreview';
import { updateQuery } from 'reducers/recipesReducer';

export default graphql(
  gql`
    query recipes($offset: Int, $keywords: String) {
      recipesCount(keywords: $keywords)
      recipes(offset: $offset, keywords: $keywords) {
        ...RecipePreviewFragment
      }
    }
    ${RecipePreviewFragments.recipe}
  `,
  {
    options: ownProps => ({
      variables: { offset: 0, keywords: ownProps.match.params.keywords }
    }),
    props: ({ data }) => {
      return {
        data,
        refetchRecipes: data.refetch,
        loadMoreRecipes() {
          return data.fetchMore({
            variables: { offset: data.recipes.length },
            updateQuery
          });
        }
      };
    }
  }
);
