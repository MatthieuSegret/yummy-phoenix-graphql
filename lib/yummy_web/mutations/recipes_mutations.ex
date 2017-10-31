defmodule YummyWeb.Mutations.RecipesMutations do
  use Absinthe.Schema.Notation
  import Kronky.Payload

  alias Yummy.Repo
  alias Yummy.Recipes
  alias Yummy.Recipes.Recipe

  payload_object(:recipe_payload, :recipe)

  input_object :recipe_input do
    field :title, non_null(:string)
    field :content, non_null(:string)
    field :total_time, non_null(:string)
    field :level, non_null(:string)
    field :budget, non_null(:string)
  end

  object :recipes_mutations do

    @desc "Create a recipe"
    field :create_recipe, :recipe_payload do
      arg :input, non_null(:recipe_input)

      resolve fn (%{input: params}, _) ->
        case Recipes.create(params) do
          {:ok, recipe} -> {:ok, recipe}
          {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
        end
      end
    end

    @desc "Update a Recipe and return Recipe"
    field :update_recipe, :recipe_payload do
      arg :id, non_null(:id)
      arg :input, non_null(:recipe_input)

      resolve fn (%{input: params} = args, _) ->
        recipe = Recipe |> Repo.get!(args[:id])
        case Recipes.update(recipe, params) do
          {:ok, recipe} -> {:ok, recipe}
          {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
        end
      end
    end

    @desc "Destroy a Recipe"
    field :delete_recipe, :recipe_payload do
      arg :id, non_null(:id)

      resolve fn (args, _) ->
        Recipe
        |> Repo.get!(args[:id])
        |> Repo.delete()
      end
    end

  end
end