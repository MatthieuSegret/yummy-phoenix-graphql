import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import gql from 'graphql-tag';

import withFlashMessage from 'components/withFlashMessage';
import withUserForEditing from 'queries/users/userForEditingQuery';
import withUpdateUser from 'mutations/users/updateUserMutation';
import RenderField from 'components/form/RenderField';
import SubmitField from 'components/form/SubmitField';

class EditUserProfile extends Component {
  static propTypes = {
    redirect: PropTypes.func,
    updateUser: PropTypes.func,
    handleSubmit: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.submitForm = this.submitForm.bind(this);
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

  render() {
    const { loading } = this.state;
    const { handleSubmit, pristine, submitting } = this.props;

    return (
      <div className="edit-user-profile">
        <div className="columns">
          <div className="column is-offset-one-quarter is-half">
            <h1 className="title is-2">Edit profile</h1>
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
  withUpdateUser
)(EditUserProfile);
