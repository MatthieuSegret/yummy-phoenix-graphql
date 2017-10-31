defmodule YummyWeb.Queries.AccountsQueries do
  use Absinthe.Schema.Notation

  object :accounts_queries do
    @desc "Fetch the current user"
    field :current_user, :user do
      resolve fn _, %{context: context} ->
        {:ok, context[:current_user]}
      end
    end
  end
end