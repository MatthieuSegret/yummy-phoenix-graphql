defmodule YummyWeb.Resolvers.AccountsResolvers do
  alias Yummy.Accounts
  import YummyWeb.Helpers.ValidationMessageHelpers

  @doc """
    Queries resolvers
  """

  def current_user(_, %{context: context}) do
    case context do
      %{current_user: current_user} -> {:ok, current_user}
      _ -> {:ok, nil}
    end
  end


  @doc """
    Mutations resolvers
  """

  def login(%{input: params}, _) do
    with {:ok, email} <- Map.fetch(params, :email),
        {:ok, password} <- Map.fetch(params, :password),
        {:ok, user} <- Accounts.authenticate(email, password),
        {:ok, jwt, _ } <- YummyWeb.Guardian.encode_and_sign(user)
    do
      {:ok, %{token: jwt}}
    else
      {:error, msg} -> {:ok, generic_message(msg)}
      :error -> {:ok, generic_message("Email ou mot de passe invalide")}
    end
  end

  def create_user(%{input: params}, _) do
    case Accounts.create_user(params) do
      {:ok, user} -> {:ok, user}
      {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
    end
  end

  def update_user(%{input: params}, %{context: context}) do
    current_user = context[:current_user]
    case current_user |> Accounts.update_user(params) do
      {:ok, user} -> {:ok, user}
      {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
    end
  end

  def change_password(%{input: params}, %{context: context}) do
    current_user = context[:current_user]
    params[:password]
    params[:password_confirmation]
    params[:current_password]
    case current_user |> Accounts.change_password(params) do
      {:ok, user} -> {:ok, user}
      {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
    end
  end
end