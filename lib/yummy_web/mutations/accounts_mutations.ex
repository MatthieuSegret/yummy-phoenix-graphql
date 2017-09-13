defmodule YummyWeb.Mutations.AccountsMutations do
  use Absinthe.Schema.Notation
  import Kronky.Payload
  alias YummyWeb.Resolvers.AccountsResolvers
  payload_object(:session_payload, :session)

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
  end
end