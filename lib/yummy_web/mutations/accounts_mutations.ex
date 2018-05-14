defmodule YummyWeb.Mutations.AccountsMutations do
  use Absinthe.Schema.Notation

  import YummyWeb.Helpers.ValidationMessageHelpers

  alias YummyWeb.Schema.Middleware
  alias YummyWeb.Email
  alias Yummy.{Accounts, Confirmations, Mailer}

  object :accounts_mutations do

    @desc "Sign up"
    field :sign_up, :user_payload do
      arg :name, :string
      arg :email, :string
      arg :password, :string
      arg :password_confirmation, :string

      resolve fn (args, _) ->
        with {:ok, created_user} <- Accounts.create_user(args),
          {:ok, _code, user_with_code} <- Confirmations.generate_confirmation_code(created_user),
          %Bamboo.Email{} = welcome_email <- Email.welcome(user_with_code)
        do
          Mailer.deliver_now(welcome_email)
          {:ok, user_with_code}
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

    @desc "confirm account"
    field :confirm_account, :session_payload do
      arg :email, non_null(:string)
      arg :code, non_null(:string)

      resolve fn (args, %{context: context}) ->
        with {:ok, user} <- Accounts.user_by_email(args[:email]),
          {:ok, confirmed_user} <- Confirmations.confirm_account(user, args[:code] |> String.trim()),
          {:ok, token, user_with_token} <- Accounts.generate_access_token(confirmed_user),
          {:ok, _tracked_user} <- Accounts.update_tracked_fields(user_with_token, context[:remote_ip])
        do
          {:ok, %{token: token}} 
        else
          {:error, %Ecto.Query{} = _query} -> {:ok,  generic_message("L'email #{args[:email]} n'a pas été trouvé")}
          {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
          _ -> {:error, "Oups, nous sommes désolés, mais quelque chose s'est mal passé"}
        end
      end
    end

    @desc "Resend confirmation"
    field :resend_confirmation, :boolean_payload do
      arg :email, non_null(:string)
      resolve fn (args, _) ->
        with {:ok, user} <- Accounts.user_by_email(args[:email]),
          {:ok, _code, user_with_code} <- Confirmations.generate_confirmation_code(user),
          %Bamboo.Email{} = confirmation_email <- Email.new_confirmation_code(user_with_code)
        do
          Mailer.deliver_now(confirmation_email)
          {:ok, true}
        else
          {:error, %Ecto.Query{}} -> {:ok,  generic_message("L'email #{args[:email]} n'a pas été trouvé")}
          {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
          _ -> {:error, "Oups, nous sommes désolés, mais quelque chose s'est mal passé"}
        end
      end
    end
  end
end