defmodule YummyWeb.Schema.AccountsTypes do
  use Absinthe.Schema.Notation

  @desc "An user entry, returns basic user information"
  object :user do
    field(:id, :id)
    field(:name, :string)
    field(:email, :string)
  end

  @desc "token to authenticate user"
  object :session do
    field(:token, :string)
  end
end
