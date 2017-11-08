import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { graphql } from 'react-apollo';

import withFlashMessage from 'components/withFlashMessage';
import RenderField from 'components/form/RenderField';
import SubmitField from 'components/form/SubmitField';

import USER_FOR_EDITING from 'graphql/users/userForEditingQuery.graphql';
import UPDATE_USER from 'graphql/users/updateUserMutation.graphql';
import CANCEL_ACCOUNT from 'graphql/users/cancelAccountMutation.graphql';

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
    return this.props.updateUser(values).then(response => {
      const errors = response.data.updateUser.errors;
      if (!errors) {
        this.props.redirect('/', { notice: 'Votre profil a bien été mis à jour' });
      } else {
        this.setState({ loading: false });
        throw new SubmissionError(errors);
      }
    });
  }

  onCancelAccount() {
    if (window.confirm('Etes vous sûr ?')) {
      return this.props.cancelAccount().then(response => {
        if (!response.data.cancelAccount.errors) {
          window.localStorage.removeItem('yummy:token');
          window.location = '/';
        }
      });
    }
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

const withUserForEditing = graphql(USER_FOR_EDITING, {
  options: ownProps => ({
    fetchPolicy: 'network-only'
  })
});

const withUpdateUser = graphql(UPDATE_USER, {
  props: ({ mutate }) => ({
    updateUser(user) {
      return mutate({ variables: { ...user } });
    }
  })
});

const withCancelAccount = graphql(CANCEL_ACCOUNT, {
  props: ({ mutate }) => ({
    cancelAccount(user) {
      return mutate();
    }
  })
});

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
