defmodule YummyWeb.Mutations.RecipeMutations do
  use Absinthe.Schema.Notation
  import Kronky.Payload
  alias Yummy.Repo
  alias Yummy.Recipes  
  alias Yummy.Recipes.Recipe  

  import_types Kronky.ValidationMessageTypes
  payload_object(:recipe_payload, :recipe)

  object :recipe_mutations do

    @desc "Create a recipe"
    field :create_recipe, :recipe_payload do
      arg :title, non_null(:string)
      arg :content, non_null(:string)
      arg :total_time, non_null(:string)
      arg :level, non_null(:string)
      arg :budget, non_null(:string)

      resolve fn args, _ ->
        case Recipes.create(args) do
          {:ok, recipe} -> {:ok, recipe}
          {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
        end
      end
    end

    @desc "Update a Recipe and return Recipe"
    field :update_recipe, :recipe_payload do
      arg :id, non_null(:id)
      arg :title, non_null(:string)
      arg :content, non_null(:string)
      arg :total_time, non_null(:string)
      arg :level, non_null(:string)
      arg :budget, non_null(:string)

      resolve fn args, _ ->
        recipe = Recipe |> Repo.get!(args[:id])
        case Recipes.update(recipe, args) do
          {:ok, recipe} -> {:ok, recipe}
          {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
        end
      end
    end

    @desc "Destroy a Recipe"
    field :delete_recipe, :recipe_payload do
      arg :id, non_null(:id)

      resolve fn args, _ ->
        Recipe
        |> Repo.get!(args[:id])
        |> Repo.delete()
      end
    end

  end
end