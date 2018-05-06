defmodule Yummy.Repo.Migrations.AddConfirmationFieldsToUsers do
  use Ecto.Migration

  def up do
    alter table(:users) do
      add :confirmation_code, :string
      add :confirmed_at, :timestamptz
      add :confirmation_sent_at, :timestamptz
    end
  end

  def down do
    alter table(:users) do
      remove :confirmation_code
      remove :confirmed_at
      remove :confirmation_sent_at
    end
  end
end
