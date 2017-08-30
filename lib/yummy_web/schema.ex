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

    @desc "fetch a Recipe by id"
    field :recipe, :recipe do
      arg :id, non_null(:id)
      resolve fn args, _ ->
        recipe = Recipe |> Repo.get!(args[:id])
        {:ok, recipe}
      end
    end

  end
end