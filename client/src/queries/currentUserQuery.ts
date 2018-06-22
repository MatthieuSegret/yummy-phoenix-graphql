import { graphql } from 'react-apollo';

import CURRENT_USER from 'graphql/users/currentUserQuery.graphql';

export default graphql(CURRENT_USER, {
  props: ({ data }) => ({
    ...data,
    currentUserLoading: data && data.loading
  })
});
