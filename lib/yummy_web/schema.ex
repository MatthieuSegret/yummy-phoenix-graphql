defmodule YummyWeb.Graph.Schema do
  use Absinthe.Schema

  import Kronky.Payload
  alias YummyWeb.Schema.Middleware.TranslateMessages

  import_types Absinthe.Type.Custom
  import_types Kronky.ValidationMessageTypes 
  import_types YummyWeb.Schema.OptionTypes
  import_types YummyWeb.Schema.AccountsTypes
  import_types YummyWeb.Schema.RecipesTypes
  import_types YummyWeb.Queries.AccountsQueries
  import_types YummyWeb.Queries.RecipesQueries
  import_types YummyWeb.Mutations.AuthMutations
  import_types YummyWeb.Mutations.AccountsMutations
  import_types YummyWeb.Mutations.RecipesMutations
  import_types Absinthe.Plug.Types

  query do
    import_fields :accounts_queries
    import_fields :recipes_queries
  end

  mutation do
    import_fields :auth_mutations
    import_fields :accounts_mutations
    import_fields :recipes_mutations
  end

  def middleware(middleware, _field, %Absinthe.Type.Object{identifier: :mutation}) do
    middleware ++ [&build_payload/2, TranslateMessages]
  end

  def middleware(middleware, _field, _object) do
    middleware
  end
end