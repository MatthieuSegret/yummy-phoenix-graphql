defmodule Yummy.Repo.Migrations.UseTimestampsWithTimezone do
  use Ecto.Migration

  def change do
    alter table(:users) do
      modify :inserted_at, :timestamptz
      modify :updated_at, :timestamptz
    end
    alter table(:recipes) do
      modify :inserted_at, :timestamptz
      modify :updated_at, :timestamptz
    end
    alter table(:comments) do
      modify :inserted_at, :timestamptz
      modify :updated_at, :timestamptz
    end
  end
end
