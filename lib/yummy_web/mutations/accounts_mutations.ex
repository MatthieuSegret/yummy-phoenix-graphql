defmodule YummyWeb.Mutations.AccountsMutations do
  use Absinthe.Schema.Notation

  import Kronky.Payload

  alias YummyWeb.Schema.Middleware  
  alias Yummy.Accounts

  payload_object(:user_payload, :user)

  object :accounts_mutations do

    @desc "Sign up"
    field :sign_up, :user_payload do
      arg :name, non_null(:string)
      arg :email, non_null(:string)
      arg :password, non_null(:string)
      arg :password_confirmation, non_null(:string)

      resolve fn (args, _) ->
        with {:ok, user} <- Accounts.create_user(args),
          {:ok, token, user_with_token} <- Accounts.generate_access_token(user)
        do
          {:ok, user_with_token}
        else
          {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
          _ -> {:error, "Oups, nous sommes désolés, mais quelque chose s'est mal passé"}
        end
      end
    end

    @desc "Update current user profile"
    field :update_user, :user_payload do
      arg :name, non_null(:string)
      arg :email, non_null(:string)
      middleware Middleware.Authorize

      resolve fn (args, %{context: context}) ->
        case context[:current_user] |> Accounts.update_user(args) do
          {:ok, user} -> {:ok, user}
          {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
        end
      end
    end

    @desc "Change user password"
    field :change_password, :user_payload do
      arg :password, non_null(:string)
      arg :password_confirmation, non_null(:string)
      arg :current_password, non_null(:string)
      middleware Middleware.Authorize
      
      resolve fn (args, %{context: context}) ->
        case context[:current_user] |> Accounts.change_password(args) do
          {:ok, user} -> {:ok, user}
          {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
        end
      end
    end
  end
end