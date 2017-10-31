import React, { Component } from 'react';

export default class NotFound extends Component {
  render() {
    return (
      <div className="content">
        <h2 className="title is-2 has-text-centered">404 la page n'existe pas</h2>
        <p className="has-text-centered">Nous sommes désolés mais la page que vous recherchez n'existe pas.</p>
      </div>
    );
  }
}
