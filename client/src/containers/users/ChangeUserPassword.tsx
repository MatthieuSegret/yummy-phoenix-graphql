import * as React from 'react';
import { graphql, compose } from 'react-apollo';
import withMutationState from 'apollo-mutation-state';
import { Form, Field } from 'react-final-form';

import withFlashMessage from 'components/flash/withFlashMessage';
import RenderField from 'components/form/RenderField';
import SubmitField from 'components/form/SubmitField';

import CHANGE_USER_PASSWORD from 'graphql/users/changeUserPasswordMutation.graphql';

// typings
import { ApolloQueryResult } from 'apollo-client/core/types';
import {
  FlashMessageVariables,
  ChangePasswordMutation,
  ChangePasswordMutationVariables,
  MutationState,
  MutationStateProps,
  User
} from 'types';

interface IProps {
  redirect: (path: string, message: FlashMessageVariables) => void;
  handleSubmit: (event: any) => void;
  changePassword: ({  }: ChangePasswordMutationVariables) => Promise<ApolloQueryResult<ChangePasswordMutation>>;
  mutation: MutationState;
}

class ChangeUserPassword extends React.Component<IProps, {}> {
  private changePasswordForm: any;

  constructor(props: IProps) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }

  private async submitForm(values: any) {
    const { data: { changePassword: { errors } } } = await this.props.changePassword(values);
    if (!errors) {
      this.props.redirect('/', { notice: 'Votre mot de passe a bien été mis à jour' });
    } else {
      this.changePasswordForm.form.change('currentPassword', '');
      this.changePasswordForm.form.change('password', '');
      this.changePasswordForm.form.change('passwordConfirmation', '');
      return errors;
    }
  }

  public render() {
    const { mutation: { loading } } = this.props;

    return (
      <div className="change-user-password">
        <div className="columns">
          <div className="column is-offset-one-quarter is-half">
            <h1 className="title is-3">Changer votre mot de passe</h1>
            <Form
              onSubmit={this.submitForm}
              ref={(input: any) => {
                this.changePasswordForm = input;
              }}
              render={({ handleSubmit, pristine }: any) => (
                <form onSubmit={handleSubmit}>
                  <Field name="currentPassword" label="Mot de passe actuel" type="password" component={RenderField} />
                  <Field name="password" label="Nouveau mot de passe" type="password" component={RenderField} />
                  <Field
                    name="passwordConfirmation"
                    label="Confirmer votre mot de passe"
                    type="password"
                    component={RenderField}
                  />
                  <SubmitField loading={loading} disabled={pristine} value="Mise à jour" />
                </form>
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}

const withChangeUserPassword = graphql<ChangePasswordMutation, ChangePasswordMutationVariables & MutationStateProps>(
  CHANGE_USER_PASSWORD,
  {
    props: ({ mutate, ownProps: { wrapMutate } }) => ({
      changePassword(user: User) {
        return wrapMutate(mutate!({ variables: { ...user } }));
      }
    })
  }
);

export default compose(
  withMutationState({ wrapper: true, propagateError: true }),
  withChangeUserPassword,
  withFlashMessage
)(ChangeUserPassword);
