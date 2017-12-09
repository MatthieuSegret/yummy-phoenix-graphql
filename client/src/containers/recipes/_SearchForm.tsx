import * as React from 'react';
import { withRouter } from 'react-router';
import { compose } from 'react-apollo';

// typings
import { History } from 'history';

interface IProps {
  initialKeywords: string;
  history: History;
}

interface IStates {
  keywords: string;
}

class SearchForm extends React.Component<IProps, IStates> {
  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  public componentWillMount() {
    this.setState({ keywords: this.props.initialKeywords });
  }

  private onInputChange(event) {
    this.setState({ keywords: event.target.value });
  }

  private onSearch(event) {
    event.preventDefault();
    const { keywords } = this.state;
    const pathName = keywords ? `/recipes/search/${keywords}` : '/';
    this.props.history.push(pathName);
  }

  public render() {
    return (
      <form onSubmit={this.onSearch} role="search">
        <div className="field has-addons">
          <div className="control">
            <input
              className="input"
              type="text"
              name="keywords"
              value={this.state.keywords}
              onChange={this.onInputChange}
            />
          </div>
          <div className="control">
            <input className="button" name="commit" type="submit" value="Rechercher" />
          </div>
        </div>
      </form>
    );
  }
}

export default compose(withRouter)(SearchForm);
