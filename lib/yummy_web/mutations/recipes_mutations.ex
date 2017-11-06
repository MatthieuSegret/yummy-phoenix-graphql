defmodule YummyWeb.Mutations.RecipesMutations do
  use Absinthe.Schema.Notation
  import Ecto.Query
  import Kronky.Payload
  import YummyWeb.Helpers.ValidationMessageHelpers

  alias YummyWeb.Schema.Middleware
  alias Yummy.Repo
  alias Yummy.Recipes
  alias Yummy.Recipes.Recipe

  payload_object(:recipe_payload, :recipe)

  input_object :recipe_input do
    field :title, :string
    field :content, :string
    field :total_time, :string
    field :level, :string
    field :budget, :string
  end

  object :recipes_mutations do

    @desc "Create a recipe"
    field :create_recipe, :recipe_payload do
      arg :input, :recipe_input
      middleware Middleware.Authorize

      resolve fn (%{input: params}, %{context: context}) ->
        case context[:current_user] |> Recipes.create(params) do
          {:ok, recipe} -> {:ok, recipe}
          {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
        end
      end
    end

    @desc "Update a Recipe and return Recipe"
    field :update_recipe, :recipe_payload do
      arg :id, non_null(:id)
      arg :input, :recipe_input
      middleware Middleware.Authorize

      resolve fn (%{input: params} = args, %{context: context}) ->
        recipe = Recipe
          |> preload(:author)
          |> Repo.get!(args[:id])

        with true <- Recipes.is_author(context[:current_user], recipe),
          {:ok, recipe} <- Recipes.update(recipe, params)
        do
          {:ok, recipe}
        else
          {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
          {:error, msg} -> {:ok, generic_message(msg)}
        end
      end
    end

    @desc "Destroy a Recipe"
    field :delete_recipe, :recipe_payload do
      arg :id, non_null(:id)
      middleware Middleware.Authorize

      resolve fn (args, %{context: context}) ->
        recipe = Recipe
          |> preload(:author)
          |> Repo.get!(args[:id])

        case Recipes.is_author(context[:current_user], recipe) do
          true -> recipe |> Repo.delete()
          {:error, msg} -> {:ok, generic_message(msg)}
        end
      end
    end

  end
end