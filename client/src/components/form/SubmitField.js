import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class SubmitField extends Component {
  static propTypes = {
    value: PropTypes.string
  };

  static defaultProps = {
    value: 'Soumettre'
  };

  render() {
    let { value } = this.props;

    return (
      <div className="field is-grouped">
        <div className="control">
          <button className="button is-primary" type="submit">
            {value}
          </button>
        </div>
        <div className="control">
          <Link className="button is-link" to="/">
            Retour
          </Link>
        </div>
      </div>
    );
  }
}
