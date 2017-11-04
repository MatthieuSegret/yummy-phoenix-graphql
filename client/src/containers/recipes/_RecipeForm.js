import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, SubmissionError } from 'redux-form';

import SubmitField from 'components/form/SubmitField';
import RenderField from 'components/form/RenderField';
import withRecipeOptions from 'queries/recipes/recipeOptionsQuery';

class RecipeForm extends Component {
  static propTypes = {
    action: PropTypes.func,
    handleSubmit: PropTypes.func,
    data: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(values) {
    this.setState({ loading: true });
    return this.props.action(values).catch(errors => {
      this.setState({ loading: false });
      throw new SubmissionError(errors);
    });
  }

  render() {
    const { handleSubmit, data: { totalTimeOptions, levelOptions, budgetOptions } } = this.props;
    const { loading } = this.state;

    return (
      <form onSubmit={handleSubmit(this.submitForm)}>
        <Field name="title" label="Titre" component={RenderField} />
        <div className="columns">
          <div className="column">
            <Field name="totalTime" label="Temps" type="select" options={totalTimeOptions} component={RenderField} />
          </div>
          <div className="column">
            <Field name="level" label="Niveau" type="select" options={levelOptions} component={RenderField} />
          </div>
          <div className="column">
            <Field name="budget" type="select" options={budgetOptions} component={RenderField} />
          </div>
        </div>
        <Field name="content" label="Recette" type="textarea" inputHtml={{ rows: 14 }} component={RenderField} />

        <SubmitField loading={loading} />
      </form>
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

export default withRecipeOptions(
  reduxForm({
    form: 'RecipeForm',
    validate
  })(RecipeForm)
);
