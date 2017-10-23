defmodule Yummy.Accounts do
  import Ecto.Query, warn: false
  alias Yummy.Repo
  alias Yummy.Accounts.User

  def create_user(attrs) do
    %User{}
    |> User.changeset_with_password(attrs)
    |> Repo.insert()
  end

  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  def change_password(%User{} = user, %{password: password}) do
    user
    |> User.changeset_with_password(%{password: password})
    |> Repo.update()
  end

  def authenticate(email, password) do
    user = User |> Repo.get_by(email: String.downcase(email))
    case check_password(user, password) do
      true -> {:ok, user}
      _ -> {:error, "Email ou mot de passe invalide"}
    end
  end

  defp check_password(user, password) do
    case user do
      nil -> false
      _ -> Comeonin.Bcrypt.checkpw(password, user.password_hash)
    end
  end
end
