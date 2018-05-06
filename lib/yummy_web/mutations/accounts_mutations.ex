defmodule YummyWeb.Mutations.AccountsMutations do
  use Absinthe.Schema.Notation

  import YummyWeb.Helpers.ValidationMessageHelpers

  alias YummyWeb.Schema.Middleware  
  alias Yummy.Accounts

  object :accounts_mutations do

    @desc "Sign up"
    field :sign_up, :session_payload do
      arg :name, :string
      arg :email, :string
      arg :password, :string
      arg :password_confirmation, :string

      resolve fn (args, %{context: context}) ->
        with {:ok, user} <- Accounts.create_user(args),
          {:ok, token, _user_with_token} <- Accounts.generate_access_token(user)
        do
          user
          |> Accounts.send_confirmation()
          |> Accounts.update_tracked_fields(context[:remote_ip])

          {:ok, %{token: token}}
        else
          {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
          _ -> {:error, "Oups, nous sommes désolés, mais quelque chose s'est mal passé"}
        end
      end
    end

    @desc "Update current user profile"
    field :update_user, :user_payload do
      arg :name, :string
      arg :email, :string
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
      arg :password, :string
      arg :password_confirmation, :string
      arg :current_password, :string
      middleware Middleware.Authorize
      
      resolve fn (args, %{context: context}) ->
        with {:ok, _user} <- Accounts.authenticate(context[:current_user].email, args[:current_password]),
          {:ok, user} <- context[:current_user] |> Accounts.change_password(args)
        do
          {:ok, user}
        else
          {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
          {:error, _msg} -> {:ok, message(:current_password, "Le mot de passe n'est pas valide")}
        end
      end
    end

    @desc "Cancel Account"
    field :cancel_account, :boolean do
      middleware Middleware.Authorize
      resolve fn (_, %{context: context}) ->
        context[:current_user] |> Accounts.cancel_account()
        {:ok, true}
      end
    end
  end
end