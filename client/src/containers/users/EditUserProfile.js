import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
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

    return (
      <div className="edit-user-profile">
        <div className="columns">
          <div className="column is-offset-one-quarter is-half">
            <h1 className="title is-3">Edit profile</h1>
            <form onSubmit={this.props.handleSubmit(this.submitForm)}>
              <Field name="name" label="Nom" component={RenderField} />
              <Field name="email" label="Email" component={RenderField} />
              <SubmitField loading={loading} value="Update" />
            </form>
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
    errors.name = "can't be blank";
  }
  if (!values.email) {
    errors.email = "can't be blank";
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
