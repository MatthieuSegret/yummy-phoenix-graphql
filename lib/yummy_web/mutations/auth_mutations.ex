defmodule YummyWeb.Mutations.AuthMutations do
  use Absinthe.Schema.Notation
  
  import Kronky.Payload
  import YummyWeb.Helpers.ValidationMessageHelpers

  alias YummyWeb.Schema.Middleware
  alias Yummy.Accounts

  payload_object(:session_payload, :session)

  object :auth_mutations do

    @desc "Sign in"
    field :sign_in, :session_payload do
      arg :email, :string
      arg :password, :string

      resolve fn (args, _) ->
        with {:ok, user} <- Accounts.authenticate(args[:email], args[:password]),
          {:ok, token, _} <- Accounts.generate_access_token(user)
        do
          {:ok, %{token: token}}
        else
          {:error, msg} -> {:ok, generic_message(msg)}
          :error -> {:error, generic_message("Email ou mot de passe invalide")}
        end
      end
    end

    @desc "Revoke token"
    field :revoke_token, :boolean do
      middleware Middleware.Authorize
      resolve fn (_, %{context: context}) ->
        context[:current_user] |> Accounts.revoke_access_token()
        {:ok, true}
      end
    end
  end
end