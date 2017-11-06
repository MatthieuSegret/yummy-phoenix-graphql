defmodule Yummy.Recipes do
  import Ecto.Query, warn: false
  import Ecto.Changeset, only: [put_assoc: 3] 
  alias Yummy.Repo
  alias Yummy.Recipes.{Comment, Recipe}
  alias Yummy.Accounts.User

  def search(query, nil), do: query 
  def search(query, keywords) do
    from r in query,
    where: ilike(r.title, ^("%#{keywords}%")) or
           ilike(r.content, ^("%#{keywords}%"))
  end

  def create(user, attrs) do
    %Recipe{}
    |> Recipe.changeset(attrs)
    |> put_assoc(:author, user)
    |> Repo.insert()
  end

  def update(%Recipe{} = recipe, attrs) do
    recipe
    |> Recipe.changeset(attrs)
    |> Repo.update()
  end

  def is_author(%User{} = author, %Recipe{} = recipe) do
    if recipe.author.id == author.id do
      true
    else
      {:error, "Vous ne pouvez pas modifier la recette de quelqu'un d'autre"}
    end
  end

  def create_comment(user, recipe, attrs) do
    %Comment{}
    |> Comment.changeset(attrs)
    |> put_assoc(:author, user)
    |> put_assoc(:recipe, recipe)
    |> Repo.insert()
  end
end
