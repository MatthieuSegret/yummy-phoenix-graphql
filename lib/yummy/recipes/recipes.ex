defmodule Yummy.Recipes do
  import Ecto.Query, warn: false
  alias Yummy.Repo
  alias Yummy.Recipes.Recipe

  def search(query, nil), do: query 
  def search(query, keywords) do
    from r in query,
    where: ilike(r.title, ^("%#{keywords}%")) or
           ilike(r.content, ^("%#{keywords}%"))
  end

  def create(attrs) do
    %Recipe{}
    |> Recipe.changeset(attrs)
    |> Repo.insert()
  end
end
