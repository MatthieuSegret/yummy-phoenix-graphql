defmodule YummyWeb.Schema.RecipesTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Ecto, repo: Yummy.Repo  
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
    field :author, :user, resolve: assoc(:author)
    field :comments, list_of(:comment), resolve: assoc(:comments)
  end

  object :comment do
    field :id, :id
    field :body, :string
    field :inserted_at, :string
    field :recipe, :recipe, resolve: assoc(:recipe)
    field :author, :user, resolve: assoc(:author)
  end
end