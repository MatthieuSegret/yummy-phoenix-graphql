import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import moment from 'moment';
import 'moment/locale/fr';

import client from 'config/apolloClient';
import store from 'config/store';
import App from 'containers/layouts/App';
import ScrollToTop from 'components/ScrollToTop';

moment.locale('fr');

render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <Router>
        <ScrollToTop>
          <App />
        </ScrollToTop>
      </Router>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);
