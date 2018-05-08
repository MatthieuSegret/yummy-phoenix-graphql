defmodule Yummy.Recipes do
  import Ecto.Query, warn: false
  import Ecto.Changeset, only: [put_assoc: 3] 
  alias Yummy.{Repo, ImageUploader}
  alias Yummy.Recipes.{Comment, Recipe}
  alias Yummy.Accounts.User

  def search(query, nil), do: query 
  def search(query, keywords) do
    from r in query,
    where: ilike(r.title, ^("%#{keywords}%")) or
           ilike(r.content, ^("%#{keywords}%"))
  end

  def create(author, attrs) do
    %Recipe{}
    |> Recipe.changeset(attrs)
    |> put_assoc(:author, author)
    |> Repo.insert()
  end

  def update(%Recipe{} = recipe, attrs) do
    recipe
    |> Recipe.changeset(attrs)
    |> Repo.update()
  end

  def is_author(%User{} = user, %Recipe{} = recipe) do
    if recipe.author.id == user.id do
      true
    else
      {:error, "Vous ne pouvez pas modifier la recette de quelqu'un d'autre"}
    end
  end

  def delete(%Recipe{} = recipe) do
    {:ok, recipe} = recipe |> Repo.delete()
    delete_image_files(recipe)
    {:ok, recipe}
  end

  def delete_image(%Recipe{} = recipe) do
    {:ok, recipe} = recipe
    |> delete_image_files
    |> Recipe.changeset(%{image_url: nil})
    |> Repo.update()
    recipe
  end

  defp delete_image_files(%Recipe{image_url: nil} = recipe), do: recipe
  defp delete_image_files(%Recipe{} = recipe) do
    path = ImageUploader.url({recipe.image_url, recipe})
      |> String.split("?")
      |> List.first 
    :ok = ImageUploader.delete({path, recipe})
    recipe
  end

  def create_comment(author, recipe, attrs) do
    %Comment{}
    |> Comment.changeset(attrs)
    |> put_assoc(:author, author)
    |> put_assoc(:recipe, recipe)
    |> Repo.insert()
  end

  def data() do
    Dataloader.Ecto.new(Repo, query: &query/2)
  end

  def query(queryable, _) do
    queryable
  end
end
