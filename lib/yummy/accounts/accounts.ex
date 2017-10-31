defmodule Yummy.Accounts do
  import Ecto.Query, warn: false
  alias Yummy.Repo
  alias Yummy.Accounts.User

  def create_user(attrs) do
    %User{}
    |> User.registration_changeset(attrs)
    |> Repo.insert()
  end

  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Generate an access token and associates it with the user
  """
  def generate_access_token(user) do
    access_token = generate_token(user)
    user |> update_user(%{access_token: access_token})
    {:ok, access_token}
  end

  defp generate_token(user) do
    Base.encode64(:erlang.md5("#{:os.system_time(:milli_seconds)}-#{user.id}-#{SecureRandom.hex}"))
  end

  @doc """
  Authenticate user with email and password
  """
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