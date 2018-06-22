import * as React from 'react';
import { Mutation, MutationResult, compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Form, Field } from 'react-final-form';

import RenderField from 'components/form/RenderField';
import SubmitField from 'components/form/SubmitField';
import { required } from 'components/form/validation';
import withFlashMessage from 'components/flash/withFlashMessage';

import SIGN_UP from 'graphql/users/signUpMutation.graphql';

// typings
import { FlashMessageVariables, SignUpData, SignUpVariables } from 'types';
class SignUpMutation extends Mutation<SignUpData, SignUpVariables> {}

interface IProps {
  redirect: (path: string, message?: FlashMessageVariables) => void;
}

class SignUpUser extends React.Component<IProps, {}> {
  private signUpForm: any;

  constructor(props: IProps) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }

  private submitForm(signUp: Function) {
    return async (values: SignUpVariables) => {
      const response: MutationResult<SignUpData> = await signUp({ variables: values });
      const { signUp: payload } = response.data!;
      if (!payload.errors && payload.user && payload.user.email) {
        const emailURIEncoded = encodeURIComponent(payload.user.email);
        this.props.redirect(`/users/welcome/${emailURIEncoded}`);
      } else {
        this.signUpForm.form.change('password', '');
        this.signUpForm.form.change('passwordConfirmation', '');
        return payload.errors;
      }
    };
  }

  public render() {
    return (
      <SignUpMutation mutation={SIGN_UP}>
        {(signUp, { loading }) => (
          <div className="columns">
            <div className="column is-offset-2 is-8">
              <Form
                onSubmit={this.submitForm(signUp)}
                ref={(input: any) => {
                  this.signUpForm = input;
                }}
                render={({ handleSubmit }: any) => (
                  <form onSubmit={handleSubmit}>
                    <Field name="name" label="Nom" type="text" component={RenderField} validate={required} />
                    <Field name="email" type="text" component={RenderField} validate={required} />
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
                )}
              />
              <Link to="/users/signin">Se connecter</Link>
            </div>
          </div>
        )}
      </SignUpMutation>
    );
  }
}

export default compose(withFlashMessage)(SignUpUser);
