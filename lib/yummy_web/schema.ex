defmodule YummyWeb.Graph.Schema do
  use Absinthe.Schema
  alias Yummy.Repo
  alias Yummy.Recipes.Recipe

  import_types YummyWeb.Graph.Types.RecipeType

  query do

    @desc "get recipes list"
    field :recipes, list_of(:recipe) do
      resolve fn _, _ ->
        {:ok, Repo.all(Recipe)}
      end
    end

  end
end