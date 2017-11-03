import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import gql from 'graphql-tag';

import withFlashMessage from 'components/withFlashMessage';
import withUserForEditing from 'queries/users/userForEditingQuery';
import withCancelAccount from 'mutations/users/cancelAccountMutation';
import withUpdateUser from 'mutations/users/updateUserMutation';
import RenderField from 'components/form/RenderField';
import SubmitField from 'components/form/SubmitField';

class EditUserProfile extends Component {
  static propTypes = {
    redirect: PropTypes.func,
    cancelAccount: PropTypes.func,
    updateUser: PropTypes.func,
    handleSubmit: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.submitForm = this.submitForm.bind(this);
    this.onCancelAccount = this.onCancelAccount.bind(this);
  }

  submitForm(values) {
    this.setState({ loading: true });
    return this.props.updateUser(values).then(errors => {
      if (errors) {
        this.setState({ loading: false });
        throw new SubmissionError(errors);
      }
    });
  }

  onCancelAccount() {
    if (window.confirm('Etes vous sûr ?')) {
      return this.props.cancelAccount().then(response => {
        console.log(response);
        if (!response.errors) {
          window.localStorage.removeItem('yummy:token');
          window.location = '/';
        }
      });
    }
    return false;
  }

  render() {
    const { loading } = this.state;
    const { handleSubmit, pristine, submitting } = this.props;

    return (
      <div className="edit-user-profile">
        <div className="columns">
          <div className="column is-offset-one-quarter is-half">
            <h1 className="title is-2">Modifier votre profile</h1>
            <form onSubmit={handleSubmit(this.submitForm)}>
              <Field name="name" label="Nom" component={RenderField} />
              <Field name="email" label="Email" component={RenderField} />
              <SubmitField loading={loading} disabled={pristine || submitting} value="Mise à jour" />
            </form>

            <div className="change-password">
              <h3 className="title is-4">Mot de passe</h3>
              <Link to="/users/password/edit" className="change-password-link">
                <span className="icon">
                  <i className="fa fa-pencil" />
                </span>
                Changer votre mot de passe
              </Link>
            </div>

            <div className="cancel-account">
              <h3 className="title is-4">Supprimer votre compte Yummy ?</h3>
              <a onClick={this.onCancelAccount}>
                <span className="icon">
                  <i className="fa fa-trash-o" />
                </span>
                Supprimer votre compte
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const fragments = {
  user: gql`
    fragment UserForEditingFragment on User {
      id
      name
      email
    }
  `
};

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

export default compose(
  withUserForEditing,
  connect((state, props) => {
    const user = props.data.currentUser;
    return user ? { initialValues: { ...user } } : {};
  }),
  reduxForm({
    form: 'EditUserProfileForm',
    validate
  }),
  withFlashMessage,
  withCancelAccount,
  withUpdateUser
)(EditUserProfile);
