defmodule YummyWeb.Queries.RecipesQueries do
  use Absinthe.Schema.Notation
  alias YummyWeb.Resolvers.RecipesResolvers

  object :recipes_queries do

    @desc "get recipes list"
    field :recipes, list_of(:recipe) do
      arg :offset, :integer, default_value: 0
      arg :keywords, :string, default_value: nil
      resolve &RecipesResolvers.recipes/2
    end

    @desc "Number of recipes"
    field :recipes_count, :integer do
      arg :keywords, :string, default_value: nil
      resolve &RecipesResolvers.recipes_count/2
    end

    @desc "fetch a Recipe by id"
    field :recipe, :recipe do
      arg :id, non_null(:id)
      resolve &RecipesResolvers.recipe/2
    end

    @desc "recipe not stored with default value"
    field :recipe_with_default_value, :recipe do
      resolve &RecipesResolvers.recipe_with_default_value/2
    end

    @desc "recipe options for a field"
    field :recipe_options, list_of(:option) do
      arg :field, non_null(:string)
      resolve &RecipesResolvers.recipe_options/2    
    end
  end
end