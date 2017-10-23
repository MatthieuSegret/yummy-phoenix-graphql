defmodule YummyWeb.Mutations.AccountsMutations do
  use Absinthe.Schema.Notation
  import Kronky.Payload
  alias YummyWeb.Resolvers.AccountsResolvers
  payload_object(:session_payload, :session)
  payload_object(:user_payload, :user)
  
  input_object :user_input do
    field :name, non_null(:string)
    field :email, non_null(:string)
    field :password, non_null(:string)
  end

  input_object :change_password_input do
    field :password, non_null(:string)
    field :password_confirmation, non_null(:string)
    field :current_password, non_null(:string)
  end

  input_object :login_input do
    field :email, non_null(:string)
    field :password, non_null(:string)
  end

  object :accounts_mutations do

    @desc "Login"
    field :login, :session_payload do
      arg :input, non_null(:login_input)
      resolve &AccountsResolvers.login/2
    end

    @desc "Sign up"
    field :sign_up, :user_payload do
      arg :input, non_null(:user_input)
      resolve &AccountsResolvers.create_user/2
    end

    @desc "Update current user profile"
    field :update_recipe, :user_payload do
      arg :input, non_null(:user_input)
      resolve &AccountsResolvers.update_user/2
    end

    @desc "Change user password"
    field :change_password, :user_payload do
      arg :input, non_null(:change_password_input)
      resolve &AccountsResolvers.change_password/2
    end
  end
end