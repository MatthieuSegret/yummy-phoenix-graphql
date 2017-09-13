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
      :error -> {:error, generic_message("Email ou mot de passe invalide")}
    end
  end
end