defmodule YummyWeb.Schema.RecipesTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Ecto, repo: Yummy.Repo  
  alias YummyWeb.Helpers.StringHelpers
  alias Yummy.Recipes.Recipe
  alias Yummy.ImageUploader

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
    field :image_url, :string do
      arg :format, :string, default_value: "mini_thumb"
      resolve fn (%Recipe{image_url: image_url} = recipe, %{format: format}, _) ->
        {:ok, ImageUploader.url({image_url, recipe}, String.to_atom(format))}
      end
    end
    field :inserted_at, :datetime
    field :author, :user, resolve: assoc(:author)
    field :comments, list_of(:comment), resolve: assoc(:comments)
  end

  object :comment do
    field :id, :id
    field :body, :string
    field :inserted_at, :datetime
    field :recipe, :recipe, resolve: assoc(:recipe)
    field :author, :user, resolve: assoc(:author)
  end
end