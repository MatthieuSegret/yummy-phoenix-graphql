defmodule Yummy.Recipes.Recipe do
  use Ecto.Schema
  import Ecto.Changeset
  alias Yummy.Recipes.Recipe


  schema "recipes" do
    field :content, :string
    field :title, :string

    timestamps()
  end

  @doc false
  def changeset(%Recipe{} = recipe, attrs) do
    recipe
    |> cast(attrs, [:title, :content])
    |> validate_required([:title, :content])
  end
end
