defmodule YummyWeb.Types.RecipeType do
  use Absinthe.Schema.Notation
  alias YummyWeb.Helpers.ApplicationHelpers

  @desc "A Recipe with title and content"
  object :recipe do
    field :id, :id
    field :title, :string
    field :content, :string
    field :description, :string do
      resolve fn _, %{ source: recipe } ->
        {:ok, ApplicationHelpers.description(recipe.content)}
      end
    end
    field :total_time, :string
    field :level, :string
    field :budget, :string
  end
end