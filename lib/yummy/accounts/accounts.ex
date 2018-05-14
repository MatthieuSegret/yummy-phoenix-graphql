defmodule Yummy.Accounts do
  import Ecto.Query, warn: false
  alias Yummy.Repo
  alias Yummy.Accounts.User

  def create_user(attrs) do
    %User{}
    |> User.changeset(attrs, :password)
    |> Repo.insert()
  end

  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  def change_password(%User{} = user, %{password: password, password_confirmation: password_confirmation}) do
    user
    |> User.changeset(%{password: password, password_confirmation: password_confirmation}, :password)
    |> Repo.update()
  end

  def cancel_account(%User{} = user) do
    user |> Repo.delete()
  end

  @doc """
  Generate an access token and associates it with the user
  """
  def generate_access_token(user) do
    access_token = generate_token(user)
    user_modified = Ecto.Changeset.change(user, access_token: access_token)
    {:ok, user} = Repo.update(user_modified)
    {:ok, access_token, user}
  end

  defp generate_token(user) do
    Base.encode64(:erlang.md5("#{:os.system_time(:milli_seconds)}-#{user.id}-#{SecureRandom.hex}"))
  end

  def revoke_access_token(user) do
    user_modified = Ecto.Changeset.change(user, access_token: nil)
    {:ok, _user} = Repo.update(user_modified)
  end

  @doc """
  Authenticate user with email and password
  """
  def authenticate(nil, _password), do: {:error, "L'email n'est pas valide"}
  def authenticate(_email, nil), do: {:error, "Le mot de passe n'est pas valide"}
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


  @doc """
  Update tracked fields
  """
  def update_tracked_fields(%User{} = user, remote_ip) do
    attrs = %{
      current_sign_in_at: Timex.now,
      last_sign_in_at: user.current_sign_in_at,
      current_sign_in_ip: remote_ip,
      sign_in_count: user.sign_in_count + 1
    }

    attrs = case user.current_sign_in_ip != remote_ip do
      true -> Map.put(attrs, :last_sign_in_ip, user.current_sign_in_ip)
      _ -> attrs
    end

    user
    |> User.changeset(attrs, :tracked_fields)
    |> Repo.update
  end

  @doc """
  Get user by email
  """
  def user_by_email(email) do
    User
    |> Ecto.Query.where(email: ^String.downcase(email)) 
    |> Repo.fetch()
  end
end
