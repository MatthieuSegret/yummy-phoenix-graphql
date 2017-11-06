import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import moment from 'moment';

export default class Comment extends Component {
  static propTypes = {
    comment: PropTypes.object
  };

  render() {
    const { comment } = this.props;

    return (
      <div className={'comment'}>
        <div className="comment-content">{comment.body}</div>
        <div className="comment-meta">
          <span className="comment-author">
            Commenté par: <em>{comment.author.name}</em>
          </span>
          <span className="date">{moment(new Date(comment.inserted_at)).fromNow()}</span>
        </div>
      </div>
    );
  }
}

export const fragments = {
  comment: gql`
    fragment CommentFragment on Comment {
      id
      body
      inserted_at
      author {
        name
      }
    }
  `
};
