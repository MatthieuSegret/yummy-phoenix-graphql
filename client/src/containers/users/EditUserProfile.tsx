import * as React from 'react';
import { Query, Mutation, MutationResult, compose } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { Link } from 'react-router-dom';
import { Form, Field } from 'react-final-form';

import withFlashMessage from 'components/flash/withFlashMessage';
import RenderField from 'components/form/RenderField';
import SubmitField from 'components/form/SubmitField';
import { required } from 'components/form/validation';

import USER_FOR_EDITING from 'graphql/users/userForEditingQuery.graphql';
import UPDATE_USER from 'graphql/users/updateUserMutation.graphql';
import CANCEL_ACCOUNT from 'graphql/users/cancelAccountMutation.graphql';

// typings
import {
  FlashMessageVariables,
  CancelAccountData,
  UpdateUserVariables,
  UpdateUserData,
  GetUserForEditingData
} from 'types';
class GetUserForEditingQuery extends Query<GetUserForEditingData> {}
class UpdateUserMutation extends Mutation<UpdateUserData, UpdateUserVariables> {}
class CancelAccountMutation extends Mutation<CancelAccountData> {}

interface IProps {
  redirect: (path: string, message?: FlashMessageVariables) => void;
}

class EditUserProfile extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.onCancelAccount = this.onCancelAccount.bind(this);
  }

  private submitForm(updateUser: Function) {
    return async (values: UpdateUserVariables) => {
      const response: MutationResult<UpdateUserData> = await updateUser({ variables: values });
      const {
        updateUser: { errors }
      } = response.data!;
      if (!errors) {
        this.props.redirect('/', { notice: 'Votre profil a bien été mis à jour' });
      } else {
        return errors;
      }
    };
  }

  private onCancelAccount(cancelAccount: Function, _client: ApolloClient<any>) {
    return async (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      if (window.confirm('Etes vous sûr ?')) {
        const response: MutationResult<CancelAccountData> = await cancelAccount();
        const {
          cancelAccount: { errors }
        } = response.data!;

        if (!errors) {
          window.localStorage.removeItem('yummy:token');
          (window as any).location = '/';
          // await client.resetStore();
          // this.props.redirect('/', { notice: 'Votre compte a bien été supprimé. Nous espérons vous revoir bientôt !' });
        }
      }
    };
  }

  public render() {
    return (
      <GetUserForEditingQuery query={USER_FOR_EDITING} fetchPolicy="network-only">
        {({ data }) => {
          if (!data) return null;
          const currentUser = data.currentUser;

          return (
            <div className="edit-user-profile">
              <div className="columns">
                <div className="column is-offset-one-quarter is-half">
                  <h1 className="title is-2">Modifier votre profile</h1>
                  <UpdateUserMutation mutation={UPDATE_USER}>
                    {(updateUser, { loading }) => (
                      <Form
                        onSubmit={this.submitForm(updateUser)}
                        initialValues={currentUser}
                        render={({ handleSubmit, pristine }: any) => (
                          <form onSubmit={handleSubmit}>
                            <Field name="name" label="Nom" component={RenderField} validate={required} />
                            <Field name="email" label="Email" component={RenderField} validate={required} />
                            <SubmitField loading={loading} disabled={pristine} value="Mise à jour" />
                          </form>
                        )}
                      />
                    )}
                  </UpdateUserMutation>

                  <div className="change-password">
                    <h3 className="title is-4">Mot de passe</h3>
                    <Link to="/users/password/edit" className="change-password-link">
                      <span className="icon">
                        <i className="fa fa-pencil" />
                      </span>
                      Changer votre mot de passe
                    </Link>
                  </div>

                  <CancelAccountMutation mutation={CANCEL_ACCOUNT}>
                    {(cancelAccount, { client }) => (
                      <div className="cancel-account">
                        <h3 className="title is-4">Supprimer votre compte Yummy ?</h3>
                        <a onClick={this.onCancelAccount(cancelAccount, client)}>
                          <span className="icon">
                            <i className="fa fa-trash-o" />
                          </span>
                          Supprimer votre compte
                        </a>
                      </div>
                    )}
                  </CancelAccountMutation>
                </div>
              </div>
            </div>
          );
        }}
      </GetUserForEditingQuery>
    );
  }
}

export default compose(withFlashMessage)(EditUserProfile);
