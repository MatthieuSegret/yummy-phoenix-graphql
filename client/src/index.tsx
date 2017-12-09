import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import * as moment from 'moment';
import 'moment/locale/fr';

import client from 'config/apolloClient';
import App from 'containers/layouts/App';
import ScrollToTop from 'components/ScrollToTop';

moment.locale('fr');

render(
  <ApolloProvider client={client}>
    <Router>
      <ScrollToTop>
        <App />
      </ScrollToTop>
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
);
