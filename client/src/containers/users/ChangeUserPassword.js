import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { reduxForm, Field, SubmissionError } from 'redux-form';

import withFlashMessage from 'components/flash/withFlashMessage';
import RenderField from 'components/form/RenderField';
import SubmitField from 'components/form/SubmitField';

import CHANGE_USER_PASSWORD from 'graphql/users/changeUserPasswordMutation.graphql';

class ChangeUserPassword extends Component {
  static propTypes = {
    changePassword: PropTypes.func,
    error: PropTypes.func,
    handleSubmit: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(values) {
    this.setState({ loading: true });
    return this.props.changePassword(values).then(response => {
      const errors = response.data.changePassword.errors;
      if (!errors) {
        this.props.redirect('/', { notice: 'Votre mot de passe a bien été mis à jour' });
      } else {
        this.setState({ loading: false });
        throw new SubmissionError(errors);
      }
    });
  }

  render() {
    const { loading } = this.state;
    const { handleSubmit, pristine, submitting } = this.props;

    return (
      <div className="change-user-password">
        <div className="columns">
          <div className="column is-offset-one-quarter is-half">
            <h1 className="title is-3">Changer votre mot de passe</h1>
            <form onSubmit={handleSubmit(this.submitForm)}>
              <Field name="currentPassword" label="Mot de passe actuel" component={RenderField} type="password" />
              <Field name="password" label="Nouveau mot de passe" component={RenderField} type="password" />
              <Field
                name="passwordConfirmation"
                label="Confirmer votre mot de passe"
                component={RenderField}
                type="password"
              />
              <SubmitField loading={loading} disabled={pristine || submitting} value="Mise à jour" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const withChangeUserPassword = graphql(CHANGE_USER_PASSWORD, {
  props: ({ mutate }) => ({
    changePassword(user) {
      return mutate({ variables: { ...user } });
    }
  })
});

export default withChangeUserPassword(
  reduxForm({
    form: 'ChangeUserPasswordForm'
  })(withFlashMessage(ChangeUserPassword))
);
