import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default graphql(
  gql`
    query recipeOptions {
      totalTimeOptions: recipeOptions(field: "total_time") {
        label
        value
      }
      levelOptions: recipeOptions(field: "level") {
        label
        value
      }
      budgetOptions: recipeOptions(field: "budget") {
        label
        value
      }
    }
  `
);
