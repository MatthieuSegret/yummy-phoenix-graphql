import * as React from 'react';
import { Query } from 'react-apollo';
import { Form, Field } from 'react-final-form';

import ROOT_URL from 'config/rootUrl';
import SubmitField from 'components/form/SubmitField';
import RenderField from 'components/form/RenderField';
import { required } from 'components/form/validation';
import RECIPE_OPTIONS from 'graphql/recipes/recipeOptionsQuery.graphql';

// typings
import { RecipeOptionsData, RecipeForEditingFragment } from 'types';
class RecipeOptionsQuery extends Query<RecipeOptionsData> {}

interface IProps {
  action: (values: any) => Promise<any>;
  initialValues: Partial<RecipeForEditingFragment>;
  loading: boolean;
}

interface IState {
  removeImage: boolean;
}

export default class RecipeForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { removeImage: false };
    this.submitForm = this.submitForm.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
  }

  private async submitForm(values: any) {
    const { removeImage } = this.state;
    try {
      await this.props.action({ removeImage, ...values });
    } catch (errors) {
      return errors;
    }
  }

  private onRemoveImage() {
    this.setState({ removeImage: true });
  }

  public render() {
    const { removeImage } = this.state;
    const { initialValues: recipe, loading } = this.props;

    return (
      <RecipeOptionsQuery query={RECIPE_OPTIONS}>
        {({ data }) => {
          if (!data) return null;
          const { totalTimeOptions, levelOptions, budgetOptions } = data;

          return (
            <Form
              onSubmit={this.submitForm}
              initialValues={recipe}
              render={({ handleSubmit }: any) => (
                <form onSubmit={handleSubmit} className="recipe-form">
                  <Field name="title" label="Titre" component={RenderField} validate={required} />
                  <div className="columns">
                    <div className="column">
                      <Field
                        name="totalTime"
                        label="Temps"
                        type="select"
                        options={totalTimeOptions}
                        component={RenderField}
                      />
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
                      <img
                        src={`${ROOT_URL}${recipe.image_url}`}
                        alt={recipe.title}
                        className="recipe-image image is-96x96"
                      />
                      <a onClick={this.onRemoveImage} className="button is-text remove-image-link">
                        Supprimer
                      </a>
                    </div>
                  ) : null}
                  <Field name="image" label="Choisir une photo..." type="file" component={RenderField} />
                  <Field
                    name="content"
                    label="Recette"
                    type="textarea"
                    inputHtml={{ rows: 14 }}
                    component={RenderField}
                    validate={required}
                  />

                  <SubmitField loading={loading} />
                </form>
              )}
            />
          );
        }}
      </RecipeOptionsQuery>
    );
  }
}
