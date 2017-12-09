import * as React from 'react';
import { graphql, compose } from 'react-apollo';
import withMutationState from 'apollo-mutation-state';
import { Link } from 'react-router-dom';
import { Form, Field } from 'react-final-form';

import RenderField from 'components/form/RenderField';
import SubmitField from 'components/form/SubmitField';
import { required } from 'components/form/validation';
import withRecipes from 'queries/recipesQuery';
import withFlashMessage from 'components/flash/withFlashMessage';

import SIGN_UP from 'graphql/users/signUpMutation.graphql';
import CURRENT_USER from 'graphql/users/currentUserQuery.graphql';

// typings
import { ApolloQueryResult } from 'apollo-client/core/types';
import { DataProxy } from 'apollo-cache';
import {
  FlashMessageVariables,
  SignUpMutation,
  SignUpMutationVariables,
  RecipesQuery,
  CurrentUserQuery,
  MutationState,
  MutationStateProps
} from 'types';

interface IProps {
  redirect: (path: string, message: FlashMessageVariables) => void;
  handleSubmit: (event: any) => void;
  signUp: ({  }: SignUpMutationVariables) => Promise<ApolloQueryResult<SignUpMutation>>;
  refetchRecipes: () => Promise<ApolloQueryResult<RecipesQuery>>;
  mutation: MutationState;
}

class SignUpUser extends React.Component<IProps, {}> {
  private signUpForm: Form;

  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }

  private async submitForm(values) {
    const { data: { signUp: payload } } = await this.props.signUp(values);
    if (!payload.errors && payload.currentUser && payload.currentUser.token) {
      window.localStorage.setItem('yummy:token', payload.currentUser.token);
      await this.props.refetchRecipes();
      this.props.redirect('/', { notice: 'Bienvenue sur Yummy ! Votre compte a bien été créé.' });
    } else {
      this.signUpForm.form.change('password', '');
      this.signUpForm.form.change('passwordConfirmation', '');
      return payload.errors;
    }
  }

  public render() {
    const { mutation: { loading } } = this.props;

    return (
      <div className="columns">
        <div className="column is-offset-2 is-8">
          <Form
            onSubmit={this.submitForm}
            ref={input => {
              this.signUpForm = input;
            }}
            render={({ handleSubmit }) => (
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
    );
  }
}

const withSignUp = graphql<SignUpMutation, SignUpMutationVariables & MutationStateProps>(SIGN_UP, {
  props: ({ mutate, ownProps: { wrapMutate } }) => ({
    signUp(user) {
      return wrapMutate(
        mutate!({
          variables: { ...user },
          update: (store: DataProxy, { data: { signUp: { currentUser } } }: any): void => {
            if (!currentUser) return;
            const data = store.readQuery({ query: CURRENT_USER }) as CurrentUserQuery;
            data.currentUser = currentUser;
            store.writeQuery({ query: CURRENT_USER, data });
          }
        })
      );
    }
  })
});

export default compose(
  withMutationState({ wrapper: true, propagateError: true }),
  withSignUp,
  withFlashMessage,
  withRecipes
)(SignUpUser);
