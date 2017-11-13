defmodule Yummy.Repo.Migrations.AddUserToRecipies do
  use Ecto.Migration
  alias Yummy.Repo
  alias Yummy.Recipes.Recipe
  alias Yummy.Accounts.User
  alias Ecto.Changeset

  def change do
    alter table(:recipes) do
      add :user_id, references(:users, on_delete: :delete_all)
    end

    flush()
    if user = Repo.get(User, 1) do
      for recipe <- Repo.all(Recipe) do
        recipe
        |> Changeset.change(user_id: user.id)
        |> Repo.update()
      end
    end

    drop constraint(:recipes, "recipes_user_id_fkey")
    alter table(:recipes) do
      modify :user_id, references(:users, on_delete: :delete_all), null: false
    end
    create index(:recipes, [:user_id])
  end
end
