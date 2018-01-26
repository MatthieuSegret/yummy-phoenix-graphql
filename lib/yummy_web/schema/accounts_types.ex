defmodule YummyWeb.Schema.AccountsTypes do
  use Absinthe.Schema.Notation
  alias YummyWeb.Schema.Middleware

  @desc "An user entry, returns basic user information"
  object :user do
    field :id, :id
    field :name, :string
    field :email, :string do
      middleware Middleware.IsAccountOwner
      resolve fn (user, _, _) ->
        {:ok, user.email}
      end
    end
  end

  @desc "token to authenticate user"
  object :session do
    field :token, :string
  end
end