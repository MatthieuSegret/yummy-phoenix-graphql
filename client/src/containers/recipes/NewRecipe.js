import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';

import SubmitField from 'components/form/SubmitField';
import RenderField from 'components/form/RenderField';

class NewRecipe extends Component {
  render() {
    return (
      <div>
        <h1 className="title">Nouvelle recette</h1>

        <form>
          <Field name="title" label="Titre" component={RenderField} />
          <Field name="content" label="Recette" type="textarea" inputHtml={{ rows: 14 }} component={RenderField} />
          <SubmitField />
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

export default reduxForm({
  form: 'RecipeForm',
  validate
})(NewRecipe);
