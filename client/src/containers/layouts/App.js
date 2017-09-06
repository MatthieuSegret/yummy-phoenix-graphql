import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import AllRecipes from 'containers/recipes/AllRecipes';
import SearchRecipe from 'containers/recipes/SearchRecipe';
import NewRecipe from 'containers/recipes/NewRecipe';
import EditRecipe from 'containers/recipes/EditRecipe';
import Recipe from 'containers/recipes/Recipe';
import NotFound from 'components/NotFound';
import Header from 'containers/layouts/Header';

import { deleteFlashMessage } from 'actions/flashActions';
import FlashMessage from 'components/FlashMessage';

import 'assets/stylesheets/css/application.css';

class App extends Component {
  static propTypes = {
    history: PropTypes.object,
    deleteFlashMessage: PropTypes.func
  };

  componentWillMount() {
    const { history } = this.props;
    this.unsubscribeFromHistory = history.listen(this.handleLocationChange);
    this.handleLocationChange(history.location);
  }

  componentWillUnmount() {
    if (this.unsubscribeFromHistory) this.unsubscribeFromHistory();
  }

  handleLocationChange = location => {
    this.props.deleteFlashMessage();
  };

  render() {
    return (
      <div>
        <Header />

        <main role="main">
          <section className="section">
            <div className="container">
              <div className="columns">
                <div className="column is-offset-2 is-8">
                  <FlashMessage />
                  <Switch>
                    <Route path="/" exact component={AllRecipes} />
                    <Route path="/recipes/search/:keywords" component={SearchRecipe} />
                    <Route path="/recipes/new" component={NewRecipe} />
                    <Route path="/recipes/:id/edit" component={EditRecipe} />
                    <Route path="/recipes/:id" component={Recipe} />
                    <Route component={NotFound} />
                  </Switch>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

export default withRouter(connect(null, { deleteFlashMessage })(App));
