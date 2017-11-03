import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError, change } from 'redux-form';

import RenderField from 'components/form/RenderField';
import SubmitField from 'components/form/SubmitField';
import withFlashMessage from 'components/withFlashMessage';
import withRecipes from 'queries/recipes/recipesQuery';
import withSignUp from 'mutations/users/signUpMutation';

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
    return signUp(values).then(errors => {
      if (!errors) {
        this.props.refetchRecipes();
        this.props.redirect('/', { notice: 'Bienvenue sur Yummy ! Votre compte a bien été créé.' });
      } else {
        this.setState({ loading: false });
        this.props.change('SignUpForm', 'password', '');
        this.props.change('SignUpForm', 'passwordConfirmation', '');
        this.props.error('Des erreurs ont eu lieu, veuillez vérifier :');
        throw new SubmissionError(errors);
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

export default reduxForm({
  form: 'SignUpForm',
  validate
})(connect(null, { change })(withSignUp(withFlashMessage(withRecipes(SignUpUser)))));
