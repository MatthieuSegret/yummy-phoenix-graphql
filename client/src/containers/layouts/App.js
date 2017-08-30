import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import AllRecipes from 'containers/recipes/AllRecipes';
import Recipe from 'containers/recipes/Recipe';
import NotFound from 'components/NotFound';
import Header from 'containers/layouts/Header';

import 'assets/stylesheets/css/application.css';

export default class App extends Component {
  render() {
    return (
      <div>
        <Header />

        <main role="main">
          <section className="section">
            <div className="container">
              <div className="columns">
                <div className="column is-offset-2 is-8">
                  <Switch>
                    <Route path="/" exact component={AllRecipes} />
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
