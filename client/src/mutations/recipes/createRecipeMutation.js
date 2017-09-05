import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router';

import normalizeMessages from 'helpers/errorHelpers';
import updateQueries from 'reducers/recipesReducer';

export default function(WrappedComponent) {
  const CREATE_RECIPE = gql`
    mutation createRecipe($title: String, $content: String) {
      createRecipe(title: $title, content: $content) {
        newRecipe: result {
          id
          title
          description
        }
        messages {
          field
          message
        }
      }
    }
  `;

  function onResult(response) {
    const errors = response.errors || normalizeMessages(response.data.createRecipe.messages);
    if (!errors) {
      this.history.push('/');
    }
    return errors;
  }

  const withCreateRecipe = graphql(CREATE_RECIPE, {
    props: ({ ownProps, mutate }) => ({
      createRecipe(recipe) {
        return mutate({
          variables: { ...recipe },
          updateQueries
        }).then(onResult.bind(ownProps));
      }
    })
  });

  return withCreateRecipe(withRouter(WrappedComponent));
}
