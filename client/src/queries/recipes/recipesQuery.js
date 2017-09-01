import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const GET_RECIPES = gql`
  query recipes($offset: Int, $keywords: String) {
    recipesCount(keywords: $keywords)
    recipes(offset: $offset, keywords: $keywords) {
      id
      title
      description
    }
  }
`;

export default graphql(GET_RECIPES, {
  options: ownProps => ({
    variables: { offset: 0, keywords: ownProps.match.params.keywords }
  }),
  props: ({ data }) => {
    return {
      data,
      loadMoreRecipes() {
        return data.fetchMore({
          variables: { offset: data.recipes.length },
          updateQuery(state, { fetchMoreResult }) {
            const { recipes, recipesCount } = fetchMoreResult;
            return {
              recipes: [...state.recipes, ...recipes],
              recipesCount
            };
          }
        });
      }
    };
  }
});
