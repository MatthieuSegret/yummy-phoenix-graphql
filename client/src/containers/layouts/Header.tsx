import * as React from 'react';
import { Mutation, MutationResult, compose } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { Link } from 'react-router-dom';

import withFlashMessage from 'components/flash/withFlashMessage';
import REVOKE_TOKEN from 'graphql/auth/revokeTokenMutation.graphql';

import logo from 'assets/images/yummy-icon.png';

// typings
import { User, FlashMessageVariables, RevokeTokenData } from 'types';
class RevokeTokenMutation extends Mutation<RevokeTokenData> {}

interface IProps {
  redirect: (path: string, message?: FlashMessageVariables) => void;
  currentUser: User;
  currentUserLoading: boolean;
}

class Header extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  private logout(revokeToken: Function, client: ApolloClient<any>) {
    return async (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      const response: MutationResult<RevokeTokenData> = await revokeToken();
      const errors = response.data!.revokeToken.errors;
      if (!errors) {
        window.localStorage.removeItem('yummy:token');
        await client.resetStore();
        this.props.redirect('/', { notice: 'Vous êtes bien déconnecté(e)' });
      }
    };
  }

  private renderSignInLinks() {
    const { currentUser, currentUserLoading } = this.props;
    if (currentUserLoading) {
      return null;
    }

    if (currentUser) {
      return (
        <RevokeTokenMutation mutation={REVOKE_TOKEN}>
          {(revokeToken, { client }) => (
            <div className="navbar-end">
              <Link className="navbar-item" to="/users/profile/edit">
                {currentUser.name}
              </Link>
              <a className="navbar-item" href="#logout" onClick={this.logout(revokeToken, client)}>
                Se déconnecter
              </a>
            </div>
          )}
        </RevokeTokenMutation>
      );
    }

    return (
      <div className="navbar-end">
        <Link className="navbar-item" to="/users/signup">
          S'inscrire
        </Link>
        <Link className="navbar-item" to="/users/signin">
          Se connecter
        </Link>
      </div>
    );
  }

  public render() {
    return (
      <header className="header">
        <div className="container">
          <nav className="navbar is-primary">
            <div className="navbar-brand">
              <Link className="navbar-item" title="Yummy!" to="/">
                <img src={logo} className="yummy-icon" alt="yummy" />
              </Link>
            </div>
            <div className="navbar-menu">{this.renderSignInLinks()}</div>
          </nav>
        </div>
      </header>
    );
  }
}

export default compose(withFlashMessage)(Header);
