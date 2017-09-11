defmodule YummyWeb.Schema.RecipesTypes do
  use Absinthe.Schema.Notation
  alias YummyWeb.Resolvers.RecipesResolvers

  @desc "A Recipe with title and content"
  object :recipe do
    field :id, :id
    field :title, :string
    field :content, :string
    field :description, :string do
      resolve &RecipesResolvers.recipe_description/3
    end
    field :total_time, :string
    field :level, :string
    field :budget, :string
  end
end