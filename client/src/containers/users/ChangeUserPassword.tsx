import * as React from 'react';
import { Mutation, MutationResult, compose } from 'react-apollo';
import { Form, Field } from 'react-final-form';

import withFlashMessage from 'components/flash/withFlashMessage';
import RenderField from 'components/form/RenderField';
import SubmitField from 'components/form/SubmitField';

import CHANGE_USER_PASSWORD from 'graphql/users/changeUserPasswordMutation.graphql';

// typings
import { FlashMessageVariables, ChangePasswordData, ChangePasswordVariables } from 'types';
class ChangePasswordMutation extends Mutation<ChangePasswordData, ChangePasswordVariables> {}

interface IProps {
  redirect: (path: string, message?: FlashMessageVariables) => void;
}

class ChangeUserPassword extends React.Component<IProps, {}> {
  private changePasswordForm: any;

  constructor(props: IProps) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }

  private submitForm(changePassword: Function) {
    return async (values: ChangePasswordVariables) => {
      const response: MutationResult<ChangePasswordData> = await changePassword({ variables: values });
      const {
        changePassword: { errors }
      } = response.data!;
      if (!errors) {
        this.props.redirect('/', { notice: 'Votre mot de passe a bien été mis à jour' });
      } else {
        this.changePasswordForm.form.change('currentPassword', '');
        this.changePasswordForm.form.change('password', '');
        this.changePasswordForm.form.change('passwordConfirmation', '');
        return errors;
      }
    };
  }

  public render() {
    return (
      <ChangePasswordMutation mutation={CHANGE_USER_PASSWORD}>
        {(changePassword, { loading }) => (
          <div className="change-user-password">
            <div className="columns">
              <div className="column is-offset-one-quarter is-half">
                <h1 className="title is-3">Changer votre mot de passe</h1>
                <Form
                  onSubmit={this.submitForm(changePassword)}
                  ref={(input: any) => {
                    this.changePasswordForm = input;
                  }}
                  render={({ handleSubmit, pristine }: any) => (
                    <form onSubmit={handleSubmit}>
                      <Field
                        name="currentPassword"
                        label="Mot de passe actuel"
                        type="password"
                        component={RenderField}
                      />
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
        )}
      </ChangePasswordMutation>
    );
  }
}

export default compose(withFlashMessage)(ChangeUserPassword);
