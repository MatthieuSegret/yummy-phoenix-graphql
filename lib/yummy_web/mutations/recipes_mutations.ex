defmodule YummyWeb.Mutations.RecipesMutations do
  use Absinthe.Schema.Notation
  import Kronky.Payload
  alias YummyWeb.Resolvers.RecipesResolvers

  import_types Kronky.ValidationMessageTypes
  payload_object(:recipe_payload, :recipe)

  input_object :recipe_input do
    field :title, non_null(:string)
    field :content, non_null(:string)
    field :total_time, non_null(:string)
    field :level, non_null(:string)
    field :budget, non_null(:string)
  end

  object :recipes_mutations do

    @desc "Create a recipe"
    field :create_recipe, :recipe_payload do
      arg :input, non_null(:recipe_input)
      resolve &RecipesResolvers.create_recipe/2
    end

    @desc "Update a Recipe and return Recipe"
    field :update_recipe, :recipe_payload do
      arg :id, non_null(:id)
      arg :input, non_null(:recipe_input)
      resolve &RecipesResolvers.update_recipe/2
    end

    @desc "Destroy a Recipe"
    field :delete_recipe, :recipe_payload do
      arg :id, non_null(:id)
      resolve &RecipesResolvers.delete_recipe/2
    end

  end
end