import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import logo from 'assets/images/yummy-icon.png';

export default class Header extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    currentUserLoading: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout(event) {
    event.preventDefault();
    window.localStorage.removeItem('yummy:token');
    window.location.reload();
  }

  renderSignInLinks() {
    const { currentUser, currentUserLoading } = this.props;
    if (currentUserLoading) {
      return null;
    }

    if (currentUser) {
      return (
        <div className="navbar-end">
          <Link className="navbar-item" to="/users/profile/edit">
            {currentUser.name}
          </Link>
          <a className="navbar-item" href="#logout" onClick={this.logout}>
            Logout
          </a>
        </div>
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

  render() {
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
