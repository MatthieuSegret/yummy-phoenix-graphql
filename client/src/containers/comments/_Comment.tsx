import * as React from 'react';

import formatDate from 'utils/dateUtils';

// typings
import { CommentFragment } from 'types';

interface IProps {
  comment: CommentFragment;
}

export default class Comment extends React.Component<IProps, {}> {
  public render() {
    const { comment } = this.props;

    return (
      <div className={'comment'}>
        <div className="comment-content">{comment.body}</div>
        <div className="comment-meta">
          <span className="comment-author">
            Commenté par: <em>{comment.author.name}</em>
          </span>
          <span className="date">{formatDate(comment.inserted_at)}</span>
        </div>
      </div>
    );
  }
}
