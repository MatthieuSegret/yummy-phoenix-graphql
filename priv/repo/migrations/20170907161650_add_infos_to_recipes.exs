defmodule Yummy.Repo.Migrations.AddInfosToRecipes do
  use Ecto.Migration

  def change do
    alter table(:recipes) do
      add :total_time, :string, default: "30 min", null: false
      add :level, :string, default: "Facile", null: false
      add :budget, :string, default: "Bon marché", null: false
    end
  end
end
