import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withMutationState from 'apollo-mutation-state';
import { Link } from 'react-router-dom';
import { Form, Field } from 'react-final-form';

import withFlashMessage from 'components/flash/withFlashMessage';
import RenderField from 'components/form/RenderField';
import SubmitField from 'components/form/SubmitField';
import { required } from 'components/form/validation';

import USER_FOR_EDITING from 'graphql/users/userForEditingQuery.graphql';
import UPDATE_USER from 'graphql/users/updateUserMutation.graphql';
import CANCEL_ACCOUNT from 'graphql/users/cancelAccountMutation.graphql';

class EditUserProfile extends Component {
  static propTypes = {
    redirect: PropTypes.func,
    cancelAccount: PropTypes.func,
    updateUser: PropTypes.func,
    handleSubmit: PropTypes.func,
    data: PropTypes.object,
    mutation: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.onCancelAccount = this.onCancelAccount.bind(this);
  }

  async submitForm(values) {
    const { data: { updateUser: { errors } } } = await this.props.updateUser(values);
    if (!errors) {
      this.props.redirect('/', { notice: 'Votre profil a bien été mis à jour' });
    } else {
      return errors;
    }
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
    const { mutation: { loading }, data: { currentUser } } = this.props;

    return (
      <div className="edit-user-profile">
        <div className="columns">
          <div className="column is-offset-one-quarter is-half">
            <h1 className="title is-2">Modifier votre profile</h1>
            <Form
              onSubmit={this.submitForm}
              initialValues={currentUser}
              render={({ handleSubmit, pristine }) => (
                <form onSubmit={handleSubmit}>
                  <Field name="name" label="Nom" component={RenderField} validate={required} />
                  <Field name="email" label="Email" component={RenderField} validate={required} />
                  <SubmitField loading={loading} disabled={pristine} value="Mise à jour" />
                </form>
              )}
            />

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

const withUserForEditing = graphql(USER_FOR_EDITING, {
  options: ownProps => ({
    fetchPolicy: 'network-only'
  })
});

const withUpdateUser = graphql(UPDATE_USER, {
  props: ({ mutate, ownProps: { wrapMutate } }) => ({
    updateUser(user) {
      return wrapMutate(mutate({ variables: { ...user } }));
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
  withFlashMessage,
  withCancelAccount,
  withMutationState({ wrapper: true, propagateError: true }),
  withUpdateUser
)(EditUserProfile);
