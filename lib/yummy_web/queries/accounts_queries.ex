defmodule YummyWeb.Queries.AccountsQueries do
  use Absinthe.Schema.Notation
  alias YummyWeb.Resolvers.AccountsResolvers

  object :accounts_queries do

    @desc "Fetch the current user"
    field :current_user, :user do
      resolve &AccountsResolvers.current_user/2
    end
  end
end