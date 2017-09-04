defmodule YummyWeb.Mutations.RecipeMutations do
  use Absinthe.Schema.Notation
  import Kronky.Payload
  alias Yummy.Recipes
  import_types Kronky.ValidationMessageTypes

  payload_object(:recipe_payload, :recipe)


  object :recipe_mutations do

    @desc "Create a recipe"
    field :create_recipe, :recipe_payload do
      arg :title, non_null(:string)
      arg :content, non_null(:string)

      resolve fn args, _ ->
        case Recipes.create(args) do
          {:ok, recipe} -> {:ok, recipe}
          {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
        end
      end
    end

  end
end