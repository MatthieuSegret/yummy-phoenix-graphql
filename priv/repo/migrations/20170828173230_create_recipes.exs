defmodule Yummy.Repo.Migrations.CreateRecipes do
  use Ecto.Migration

  def change do
    create table(:recipes) do
      add :title, :string, null: false
      add :content, :text, null: false

      timestamps()
    end

  end
end
