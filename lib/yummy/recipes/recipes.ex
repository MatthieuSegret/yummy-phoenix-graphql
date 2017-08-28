defmodule Yummy.Recipes do
  import Ecto.Query, warn: false
  alias Yummy.Repo
  alias Yummy.Recipes.Recipe

  def create_recipe(attrs) do
    %Recipe{}
    |> Recipe.changeset(attrs)
    |> Repo.insert()
  end
end
