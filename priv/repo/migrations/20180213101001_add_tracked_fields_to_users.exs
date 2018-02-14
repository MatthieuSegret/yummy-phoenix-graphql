defmodule Yummy.Repo.Migrations.AddTrackedFieldsToUsers do
  use Ecto.Migration

  def up do
    alter table(:users) do
      add :current_sign_in_at, :timestamptz
      add :last_sign_in_at, :timestamptz
      add :sign_in_count, :integer, default: 0, null: false
      add :current_sign_in_ip, :string
      add :last_sign_in_ip, :string
    end
  end

  def down do
    alter table(:users) do
      remove :current_sign_in_at
      remove :last_sign_in_at
      remove :sign_in_count
      remove :current_sign_in_ip
      remove :last_sign_in_ip
    end
  end
end
