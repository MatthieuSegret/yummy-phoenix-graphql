defmodule YummyWeb.Graph.Schema do
  use Absinthe.Schema

  import Kronky.Payload
  alias YummyWeb.Middleware.TranslateMessages

  import_types YummyWeb.Types.RecipeType
  import_types YummyWeb.Queries.RecipeQueries
  import_types YummyWeb.Mutations.RecipeMutations

  query do
    import_fields :recipe_queries
  end

  mutation do
    import_fields :recipe_mutations
  end

  def middleware(middleware, _field, %Absinthe.Type.Object{identifier: :mutation}) do
    middleware ++ [&build_payload/2, TranslateMessages]
  end

  def middleware(middleware, _field, _object) do
    middleware
  end
end