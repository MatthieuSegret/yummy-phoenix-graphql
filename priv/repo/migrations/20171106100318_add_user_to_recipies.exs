defmodule Yummy.Repo.Migrations.AddUserToRecipies do
  use Ecto.Migration

  def change do
    alter table(:recipes) do
      add :user_id, references(:users, on_delete: :delete_all)
    end

    drop constraint(:recipes, "recipes_user_id_fkey")
    alter table(:recipes) do
      modify :user_id, references(:users, on_delete: :delete_all), null: false
    end
    create index(:recipes, [:user_id])
  end
end
