defmodule YummyWeb.Schema do
  use Absinthe.Schema

  import Kronky.Payload
  alias YummyWeb.Schema.Middleware.TranslateMessages
  alias Yummy.Recipes.{Recipe, Comment}

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

  payload_object(:session_payload, :session)
  payload_object(:user_payload, :user)
  payload_object(:recipe_payload, :recipe)
  payload_object(:comment_payload, :comment)

  query do
    import_fields :accounts_queries
    import_fields :recipes_queries
  end

  mutation do
    import_fields :auth_mutations
    import_fields :accounts_mutations
    import_fields :recipes_mutations
  end

  subscription do
    field :new_recipe, :recipe do
      trigger :create_recipe, topic: fn
        %Recipe{} -> ["*"]
        _ -> []
      end
      config fn _args, _info ->
        {:ok, topic: "*"}
      end
    end

    field :new_comment, :comment do
      arg :recipe_id, non_null(:id)
      trigger :create_comment, topic: fn
        %Comment{} = comment -> ["new_comment:#{comment.recipe.id}"]
        _ -> []
      end
      config fn args, _info ->
        {:ok, topic: "new_comment:#{args.recipe_id}"}
      end
    end
  end

  def middleware(middleware, _field, %Absinthe.Type.Object{identifier: :mutation}) do
    middleware ++ [&build_payload/2, TranslateMessages]
  end

  def middleware(middleware, _field, _object) do
    middleware
  end

  def plugins do
    [Absinthe.Middleware.Dataloader | Absinthe.Plugin.defaults]
  end

  def dataloader() do
    alias Yummy.Recipes
    Dataloader.new
    |> Dataloader.add_source(Recipes, Recipes.data())
  end

  def context(ctx) do
    Map.put(ctx, :loader, dataloader())
  end
end