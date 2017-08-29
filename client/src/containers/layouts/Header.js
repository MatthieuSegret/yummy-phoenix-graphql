import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import logo from 'assets/images/yummy-icon.png';

export default class Header extends Component {
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
          </nav>
        </div>
      </header>
    );
  }
}
