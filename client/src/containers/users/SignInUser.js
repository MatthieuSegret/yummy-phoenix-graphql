import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { reduxForm, Field, change } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';

import RenderField from 'components/form/RenderField';
import SubmitField from 'components/form/SubmitField';
import withFlashMessage from 'components/flash/withFlashMessage';
import withRecipes from 'queries/recipesQuery';
import withCurrentUser, { fetchCurrentUser } from 'queries/currentUserQuery';

import SIGN_IN from 'graphql/auth/signInMutation.graphql';

class SignInUser extends Component {
  static propTypes = {
    redirect: PropTypes.func,
    handleSubmit: PropTypes.func,
    change: PropTypes.func,
    signIn: PropTypes.func,
    currentUser: PropTypes.object,
    currentUserLoading: PropTypes.bool,
    refetchRecipes: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.submitForm = this.submitForm.bind(this);
    this.redirectIfUserIsAuthenticated = this.redirectIfUserIsAuthenticated.bind(this);
  }

  componentWillMount() {
    this.redirectIfUserIsAuthenticated();
  }

  componentWillReceiveProps(nextProps) {
    this.redirectIfUserIsAuthenticated(nextProps);
  }

  redirectIfUserIsAuthenticated(props = null) {
    const { currentUser, currentUserLoading } = props || this.props;
    if (!currentUserLoading && currentUser) {
      this.props.redirect('/', { error: 'Vous êtes déjà connecté.' });
    }
  }

  submitForm(values) {
    this.setState({ loading: true });

    return this.props.signIn(values).then(response => {
      const payload = response.data.signIn;
      if (!payload.errors) {
        window.localStorage.setItem('yummy:token', payload.result.token);
        fetchCurrentUser().then(() => {
          this.props.redirect('/', { notice: 'Vous êtes bien connecté(e)' });
        });
        this.props.refetchRecipes();
      } else {
        window.localStorage.removeItem('yummy:token');
        this.setState({ loading: false });
        this.props.change('SignInForm', 'password', '');
      }
    });
  }

  render() {
    const { loading } = this.state;

    return (
      <div className="columns">
        <div className="column is-offset-one-quarter is-half">
          <form onSubmit={this.props.handleSubmit(this.submitForm)}>
            <Field name="email" component={RenderField} type="text" />
            <Field name="password" label="Mot de passe" component={RenderField} type="password" />
            <SubmitField value="Se connecter" cancel={false} loading={loading} />
          </form>
          <Link to="/users/signup">S'inscrire</Link>
        </div>
      </div>
    );
  }
}

const withSignIn = graphql(SIGN_IN, {
  props: ({ mutate }) => ({
    signIn(user) {
      return mutate({ variables: { ...user } });
    }
  })
});

export default compose(
  reduxForm({
    form: 'SignInForm'
  }),
  connect(null, { change }),
  withCurrentUser,
  withSignIn,
  withFlashMessage,
  withRecipes
)(SignInUser);
