defmodule Yummy.Repo.Migrations.AddUploadsToRecipes do
  use Ecto.Migration

  def up do
    alter table(:recipes) do
      add :image_url, :string
      add :uuid, :string
    end
  end

  def down do
    alter table(:recipes) do
      remove :image_url
      remove :uuid
    end
  end
end
