defmodule YummyWeb.Schema.RecipesTypes do
  use Absinthe.Schema.Notation
  alias YummyWeb.Helpers.StringHelpers

  @desc "A Recipe with title and content"
  object :recipe do
    field :id, :id
    field :title, :string
    field :content, :string
    field :description, :string do
      resolve fn (recipe, _, _) ->
        {:ok, StringHelpers.description(recipe.content)}
      end
    end
    field :total_time, :string
    field :level, :string
    field :budget, :string
    field :inserted_at, :string
    field :author, :user
    field :comments, list_of(:comment) do
      resolve fn (recipe, _, _) ->
        {:ok, recipe.comments}
      end
    end
  end

  object :comment do
    field :id, :id
    field :body, :string
    field :inserted_at, :string
    field :recipe, :recipe
    field :author, :user
  end
end