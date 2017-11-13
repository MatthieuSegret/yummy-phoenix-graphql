import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { graphql } from 'react-apollo';

import ROOT_URL from 'config/rootUrl';
import SubmitField from 'components/form/SubmitField';
import RenderField from 'components/form/RenderField';
import RECIPE_OPTIONS from 'graphql/recipes/recipeOptionsQuery.graphql';

class RecipeForm extends Component {
  static propTypes = {
    action: PropTypes.func,
    handleSubmit: PropTypes.func,
    data: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = { loading: false, removeImage: false };
    this.submitForm = this.submitForm.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
  }

  submitForm(values) {
    const { removeImage } = this.state;
    this.setState({ loading: true });
    return this.props.action({ removeImage, ...values }).catch(errors => {
      this.setState({ loading: false });
      throw new SubmissionError(errors);
    });
  }

  onRemoveImage() {
    this.setState({ removeImage: true });
  }

  render() {
    const { handleSubmit, initialValues: recipe, data: { totalTimeOptions, levelOptions, budgetOptions } } = this.props;
    const { loading, removeImage } = this.state;

    return (
      <form onSubmit={handleSubmit(this.submitForm)} className="recipe-form">
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

        {recipe.image_url && !removeImage ? (
          <div className="field">
            <label className="label" htmlFor="recipe_image_url">
              Photo
            </label>
            <img src={`${ROOT_URL}${recipe.image_url}`} alt={recipe.title} className="recipe-image image is-96x96" />
            <a onClick={this.onRemoveImage} className="button is-text remove-image-link">
              Supprimer
            </a>
          </div>
        ) : null}
        <Field name="image" label="Choisir une photo..." type="file" component={RenderField} />
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

export default graphql(RECIPE_OPTIONS)(
  reduxForm({
    form: 'RecipeForm',
    validate
  })(RecipeForm)
);
