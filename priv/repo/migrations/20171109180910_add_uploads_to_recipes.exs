defmodule Yummy.Repo.Migrations.AddUploadsToRecipes do
  use Ecto.Migration
  alias Yummy.Repo
  alias Yummy.Recipes.Recipe
  alias Ecto.{Changeset, UUID}

  def up do
    alter table(:recipes) do
      add :image_url, :string
      add :uuid, :string
    end

    flush()
    for recipe <- Repo.all(Recipe) do
      recipe
      |> Changeset.change(uuid: UUID.generate())
      |> Repo.update()
    end
  end

  def down do
    alter table(:recipes) do
      remove :image_url
      remove :uuid
    end
  end
end
