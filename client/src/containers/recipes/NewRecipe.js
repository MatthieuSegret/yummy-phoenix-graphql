import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, SubmissionError } from 'redux-form';

import SubmitField from 'components/form/SubmitField';
import RenderField from 'components/form/RenderField';
import withCreateRecipe from 'mutations/recipes/createRecipeMutation';

class NewRecipe extends Component {
  static propTypes = {
    createRecipe: PropTypes.func,
    handleSubmit: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(values) {
    this.setState({ loading: true });
    return this.props.createRecipe(values).then(errors => {
      if (errors) {
        this.setState({ loading: false });
        throw new SubmissionError(errors);
      }
    });
  }

  render() {
    const { handleSubmit } = this.props;
    const { loading } = this.state;

    return (
      <div>
        <h1 className="title">Nouvelle recette</h1>

        <form onSubmit={handleSubmit(this.submitForm)}>
          <Field name="title" label="Titre" component={RenderField} />
          <Field name="content" label="Recette" type="textarea" inputHtml={{ rows: 14 }} component={RenderField} />
          <SubmitField loading={loading} />
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};
  if (!values.title) {
    errors.title = 'doit être rempli(e)';
  }
  if (!values.content) {
    errors.content = 'doit être rempli(e)';
  }
  return errors;
}

export default withCreateRecipe(
  reduxForm({
    form: 'RecipeForm',
    validate
  })(NewRecipe)
);
