defmodule Yummy.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Yummy.Accounts.User


  schema "users" do
    field :email, :string
    field :name, :string
    field :password, :string, virtual: true
    field :password_hash, :string
    field :access_token, :string

    timestamps()
  end

  def changeset(%User{} = user, params \\ %{}) do
    params = params |> Map.delete(:password)
    user
    |> cast(params, [:name, :email, :access_token])
    |> validate_required([:name, :email])
  end
 
  def registration_changeset(%User{} = user, params \\ %{}) do
    user
    |> cast(params, [:name, :email, :password])
    |> validate_required([:name, :email, :password])
    |> put_pass_hash()
  end
 
  defp put_pass_hash(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: pass}} ->
        put_change(changeset, :password_hash, Comeonin.Bcrypt.hashpwsalt(pass))
      _ ->
        changeset
    end
  end
end
