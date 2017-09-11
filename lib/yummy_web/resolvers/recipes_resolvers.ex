defmodule YummyWeb.Resolvers.RecipesResolvers do
  import Ecto.Query
  alias Yummy.Repo
  alias Yummy.Recipes
  alias Yummy.Recipes.Recipe
  alias YummyWeb.Helpers.ApplicationHelpers


  @doc """
    Queries resolvers
  """

  def recipes(args, _) do
    recipes = Recipe
    |> Recipes.search(args[:keywords])
    |> order_by(desc: :inserted_at)
    |> Repo.paginate(args[:offset])
    |> Repo.all
    {:ok, recipes}
  end

  def recipes_count(args, _) do
    recipes_count = Recipe
    |> Recipes.search(args[:keywords])
    |> Repo.count
    {:ok, recipes_count}
  end

  def recipe(args, _) do
    recipe = Recipe |> Repo.get!(args[:id])
    {:ok, recipe}
  end

  def recipe_with_default_value(_,_) do
    {:ok, Recipe.default_values()}
  end

  def recipe_options(args,_) do
    field = String.to_existing_atom(args[:field])
    options = Enum.map(Recipe.options()[field], fn opt ->
        %{label: opt, value: opt}
    end)
    {:ok, options}
  end

  @doc """
    Mutations resolvers
  """

  def create_recipe(%{input: params}, _) do
    case Recipes.create(params) do
      {:ok, recipe} -> {:ok, recipe}
      {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
    end
  end

  def update_recipe(%{input: params} = args, _) do
    recipe = Recipe |> Repo.get!(args[:id])
    case Recipes.update(recipe, params) do
      {:ok, recipe} -> {:ok, recipe}
      {:error, %Ecto.Changeset{} = changeset} -> {:ok, changeset}
    end
  end

  def delete_recipe(args, _) do
    Recipe
    |> Repo.get!(args[:id])
    |> Repo.delete()
  end


  @doc """
    Types resolvers
  """

  def recipe_description(recipe, _, _) do
    {:ok, ApplicationHelpers.description(recipe.content)}
  end
end