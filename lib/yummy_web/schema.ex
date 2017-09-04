defmodule YummyWeb.Graph.Schema do
  use Absinthe.Schema

  import_types YummyWeb.Types.RecipeType
  import_types YummyWeb.Queries.RecipeQueries
  import_types YummyWeb.Mutations.RecipeMutations

  query do
    import_fields :recipe_queries
  end

  mutation do
    import_fields :recipe_mutations
  end
end