import * as React from 'react';
import classnames from 'classnames';
import { Browser } from 'react-kawaii';
import { Form, Field } from 'react-final-form';
import { graphql, compose } from 'react-apollo';
import withMutationState from 'apollo-mutation-state';

import { required } from 'components/form/validation';
import withFlashMessage from 'components/flash/withFlashMessage';
import withRecipes from 'queries/recipesQuery';
import { fetchCurrentUser } from 'queries/currentUserQuery';

import CONFIRM_ACCOUNT from 'graphql/users/confirmAccountMutation.graphql';
import RESEND_CONFIRMATION from 'graphql/users/resendConfirmationMutation.graphql';

// typings
import { ApolloQueryResult } from 'apollo-client/core/types';
import {
  FlashMessageVariables,
  ConfirmAccountMutation,
  ConfirmAccountMutationVariables,
  ResendConfirmationMutation,
  ResendConfirmationMutationVariables,
  RecipesQuery,
  MutationState,
  MutationStateProps
} from 'types';

interface IProps {
  redirect: (path: string, message?: FlashMessageVariables) => void;
  error: (text: string) => void;
  notice: (text: string) => void;
  handleSubmit: (event: any) => void;
  refetchRecipes: () => Promise<ApolloQueryResult<RecipesQuery>>;
  confirmAccount: ({  }: ConfirmAccountMutationVariables) => Promise<ApolloQueryResult<ConfirmAccountMutation>>;
  resendConfirmation: (
    {  }: ResendConfirmationMutationVariables
  ) => Promise<ApolloQueryResult<ResendConfirmationMutation>>;
  mutation: MutationState;
  match: any;
}

interface IState {
  email: string;
  isWelcome: boolean;
}

class ConfirmationNeeded extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);

    this.state = { email: '', isWelcome: false };
    this.submitForm = this.submitForm.bind(this);
    this.onResendConfirmation = this.onResendConfirmation.bind(this);
  }

  public componentWillMount() {
    const { params: { email: emailEncoded }, url } = this.props.match;
    const isWelcome: boolean = /welcome\/(.)+/.test(url);
    this.setState({ email: decodeURIComponent(emailEncoded), isWelcome });
  }

  private async submitForm(values: any) {
    const { email } = this.state;
    const code: string = values.code;

    const { data: { confirmAccount: payload } } = await this.props.confirmAccount({ email, code });
    if (!payload.errors && payload.result && payload.result.token) {
      window.localStorage.setItem('yummy:token', payload.result.token);
      await fetchCurrentUser();
      await this.props.refetchRecipes();
      this.props.redirect('/', { notice: 'Votre compte a été validé.' });
    } else {
      if (payload.errors.alreadyConfirmed) {
        this.props.redirect('/users/signin', {
          error: 'Ce compte a déjà été validé. Vous pouvez vous connecter'
        });
      } else {
        this.props.error(Object.values(payload.errors)[0] as string);
        return payload.errors;
      }
    }
  }

  private async onResendConfirmation() {
    const { email } = this.state;
    const { data: { resendConfirmation: { errors } } } = await this.props.resendConfirmation({ email });
    if (!errors) {
      this.props.notice("L'email de confirmation a bien été renvoyé");
    } else {
      if (errors.alreadyConfirmed) {
        this.props.redirect('/users/signin', {
          error: 'Ce compte a déjà été validé. Vous pouvez vous connecter'
        });
      } else {
        this.props.error(Object.values(errors)[0] as string);
      }
    }
  }

  public render() {
    const { email, isWelcome } = this.state;
    const { mutation: { loading } } = this.props;

    return (
      <div className="confirmation-needed content">
        <h1 className="title is-3 has-text-centered">{isWelcome ? 'Bienvenue sur Yummy !' : 'Valider votre compte'}</h1>
        <p className="is-size-5 has-text-centered" />
        <Browser size={140} mood="happy" color="#83D1FB" />
        <div className="confirmation-instruction">
          <p className="is-size-5 has-text-centered">
            Un code à 6 chiffres vous a été envoyé à votre adresse :
            <strong>{` ${email}`}.</strong> Entrez le ci-dessous pour valider votre compte.
          </p>
        </div>

        <Form
          onSubmit={this.submitForm}
          render={({ handleSubmit }: any) => (
            <form onSubmit={handleSubmit} className="confirmation-form">
              <div className="field has-addons">
                <Field name="code" validate={required}>
                  {({ input, meta }: any) => (
                    <div className="control">
                      <input
                        className={classnames('input is-large', { 'is-danger': meta.touched && meta.invalid })}
                        type="text"
                        {...input}
                        placeholder="123456"
                        maxLength={6}
                      />
                      {meta.touched && meta.error && <p className="help is-danger">{meta.error}</p>}
                    </div>
                  )}
                </Field>
                <div className="control">
                  <button className={classnames('button is-primary is-large', { 'is-loading': loading })} name="commit">
                    Valider
                  </button>
                </div>
              </div>
            </form>
          )}
        />

        <p className="resend-confirmation is-size-6 has-text-centered has-text-grey">
          Vous ne l'avez pas reçu ?<br />Besoin d'un nouveau code ?<br />
          <button
            className={classnames('resend-confirmation-button button is-small is-outlined has-text-grey')}
            onClick={this.onResendConfirmation}
          >
            Renvoyer l'email
          </button>
        </p>
      </div>
    );
  }
}

const withConfirmAccount = graphql<ConfirmAccountMutation, ConfirmAccountMutationVariables & MutationStateProps>(
  CONFIRM_ACCOUNT,
  {
    props: ({ mutate, ownProps: { wrapMutate } }) => ({
      confirmAccount({ email, code }: ConfirmAccountMutationVariables) {
        return wrapMutate(mutate!({ variables: { email, code } }));
      }
    })
  }
);

const withResendConfirmation = graphql<any, ResendConfirmationMutation & MutationStateProps>(RESEND_CONFIRMATION, {
  props: ({ mutate }) => ({
    resendConfirmation({ email }: ResendConfirmationMutationVariables) {
      return mutate!({ variables: { email } });
    }
  })
});

export default compose(
  withMutationState({ wrapper: true, propagateError: true }),
  withConfirmAccount,
  withResendConfirmation,
  withFlashMessage,
  withRecipes
)(ConfirmationNeeded);
