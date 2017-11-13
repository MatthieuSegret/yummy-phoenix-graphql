import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError, change } from 'redux-form';

import RenderField from 'components/form/RenderField';
import SubmitField from 'components/form/SubmitField';
import withRecipes from 'queries/recipesQuery';
import withFlashMessage from 'components/flash/withFlashMessage';

import SIGN_UP from 'graphql/users/signUpMutation.graphql';
import CURRENT_USER from 'graphql/users/currentUserQuery.graphql';

class SignUpUser extends Component {
  static propTypes = {
    redirect: PropTypes.func,
    change: PropTypes.func,
    error: PropTypes.func,
    handleSubmit: PropTypes.func,
    signUp: PropTypes.func,
    refetchRecipes: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(values) {
    const { signUp } = this.props;
    this.setState({ loading: true });
    return signUp(values).then(response => {
      const payload = response.data.signUp;
      if (!payload.errors) {
        window.localStorage.setItem('yummy:token', payload.currentUser.token);
        this.props.refetchRecipes();
        this.props.redirect('/', { notice: 'Bienvenue sur Yummy ! Votre compte a bien été créé.' });
      } else {
        this.setState({ loading: false });
        this.props.change('SignUpForm', 'password', '');
        this.props.change('SignUpForm', 'passwordConfirmation', '');
        throw new SubmissionError(payload.errors);
      }
    });
  }

  render() {
    const { loading } = this.state;

    return (
      <div className="columns">
        <div className="column is-offset-2 is-8">
          <form onSubmit={this.props.handleSubmit(this.submitForm)}>
            <Field name="name" label="Nom" type="text" component={RenderField} />
            <Field name="email" type="text" component={RenderField} />
            <Field
              name="password"
              label="Mot de passe"
              type="password"
              hint="6 characters minimum"
              component={RenderField}
            />
            <Field
              name="passwordConfirmation"
              label="Confirmer votre mot de passe"
              type="password"
              component={RenderField}
            />
            <SubmitField value="S'inscrire" cancel={false} loading={loading} />
          </form>
          <Link to="/users/signin">Se connecter</Link>
        </div>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};
  if (!values.name) {
    errors.name = 'doit être rempli';
  }
  if (!values.email) {
    errors.email = 'doit être rempli';
  }
  return errors;
}

const withSignUp = graphql(SIGN_UP, {
  props: ({ mutate }) => ({
    signUp(user) {
      return mutate({
        variables: { ...user },
        update: (store, { data: { signUp: { currentUser } } }) => {
          if (!currentUser) return false;
          const data = store.readQuery({ query: CURRENT_USER });
          data.currentUser = currentUser;
          store.writeQuery({ query: CURRENT_USER, data });
        }
      });
    }
  })
});

export default reduxForm({
  form: 'SignUpForm',
  validate
})(connect(null, { change })(withSignUp(withFlashMessage(withRecipes(SignUpUser)))));
