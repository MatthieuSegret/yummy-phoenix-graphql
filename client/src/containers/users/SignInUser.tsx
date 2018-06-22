import * as React from 'react';
import { Mutation, MutationResult, compose } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { Link } from 'react-router-dom';
import { Form, Field } from 'react-final-form';

import RenderField from 'components/form/RenderField';
import SubmitField from 'components/form/SubmitField';
import withFlashMessage from 'components/flash/withFlashMessage';
import withCurrentUser from 'queries/currentUserQuery';

import SIGN_IN from 'graphql/auth/signInMutation.graphql';

// typings
import { FlashMessageVariables, SignInData, SignInVariables, User } from 'types';

class SignInMutation extends Mutation<SignInData, SignInVariables> {}

interface IProps {
  redirect: (path: string, message?: FlashMessageVariables) => void;
  currentUser: User;
  currentUserLoading: boolean;
}

class SignInUser extends React.Component<IProps, {}> {
  private signInForm: any;

  constructor(props: IProps) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    // this.redirectIfUserIsAuthenticated = this.redirectIfUserIsAuthenticated.bind(this);
  }

  // public componentWillMount() {
  //   this.redirectIfUserIsAuthenticated();
  // }

  // public componentWillReceiveProps(nextProps: IProps) {
  //   // console.log(nextProps);
  //   this.redirectIfUserIsAuthenticated(nextProps);
  // }

  // private redirectIfUserIsAuthenticated(props?: IProps) {
  //   const { currentUser, currentUserLoading } = props || this.props;
  //   if (!currentUserLoading && currentUser) {
  //     this.props.redirect('/', { error: 'Vous êtes déjà connecté.' });
  //   }
  // }

  private submitForm(signIn: Function, client: ApolloClient<any>) {
    return async (values: SignInVariables) => {
      const response: MutationResult<SignInData> = await signIn({ variables: values });
      const { signIn: payload } = response.data!;
      if (!payload.errors && payload.result && payload.result.token) {
        window.localStorage.setItem('yummy:token', payload.result.token);
        await client.resetStore();
        this.props.redirect('/', { notice: 'Vous êtes bien connecté(e)' });
      } else {
        window.localStorage.removeItem('yummy:token');
        if (payload.errors.noYetConfirmed) {
          const emailURIEncoded = encodeURIComponent(values.email);
          this.props.redirect(`/users/confirmation-needed/${emailURIEncoded}`);
        } else {
          this.signInForm.form.change('password', '');
        }
      }
    };
  }

  public render() {
    return (
      <SignInMutation mutation={SIGN_IN}>
        {(signIn, { loading, client }) => (
          <div className="columns">
            <div className="column is-offset-one-quarter is-half">
              <Form
                onSubmit={this.submitForm(signIn, client)}
                ref={(input: any) => {
                  this.signInForm = input;
                }}
                render={({ handleSubmit }: any) => (
                  <form onSubmit={handleSubmit}>
                    <Field name="email" component={RenderField} type="text" />
                    <Field name="password" label="Mot de passe" component={RenderField} type="password" />
                    <SubmitField value="Se connecter" cancel={false} loading={loading} />
                  </form>
                )}
              />
              <Link to="/users/signup">S'inscrire</Link>
            </div>
          </div>
        )}
      </SignInMutation>
    );
  }
}

export default compose(
  withCurrentUser,
  withFlashMessage
)(SignInUser);
