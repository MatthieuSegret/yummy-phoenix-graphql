import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const GET_RECIPES = gql`
  query recipes($keywords: String) {
    recipes(keywords: $keywords) {
      id
      title
      description
    }
  }
`;

export default graphql(GET_RECIPES, {
  options: ownProps => ({
    variables: { keywords: ownProps.match.params.keywords }
  })
});
