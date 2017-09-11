defmodule YummyWeb.Graph.Schema do
  use Absinthe.Schema

  import Kronky.Payload
  alias YummyWeb.Schema.Middleware.TranslateMessages

  import_types YummyWeb.Schema.OptionTypes
  import_types YummyWeb.Schema.RecipesTypes
  import_types YummyWeb.Queries.RecipesQueries
  import_types YummyWeb.Mutations.RecipesMutations

  query do
    import_fields :recipes_queries
  end

  mutation do
    import_fields :recipes_mutations
  end

  def middleware(middleware, _field, %Absinthe.Type.Object{identifier: :mutation}) do
    middleware ++ [&build_payload/2, TranslateMessages]
  end

  def middleware(middleware, _field, _object) do
    middleware
  end
end