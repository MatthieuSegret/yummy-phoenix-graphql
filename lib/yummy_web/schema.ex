defmodule YummyWeb.Graph.Schema do
  use Absinthe.Schema
  alias Yummy.Repo
  alias Yummy.Recipes
  alias Yummy.Recipes.Recipe

  import_types YummyWeb.Graph.Types.RecipeType

  query do

    @desc "get recipes list"
    field :recipes, list_of(:recipe) do
      arg :keywords, :string, default_value: nil
      resolve fn args, _ ->
        recipes = Recipe
        |> Recipes.search(args[:keywords])
        |> Repo.all()
        {:ok, recipes}
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