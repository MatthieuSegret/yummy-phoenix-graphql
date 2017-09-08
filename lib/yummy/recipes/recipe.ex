defmodule Yummy.Recipes.Recipe do
  use Ecto.Schema
  import Ecto.Changeset
  alias Yummy.Recipes.Recipe

  @options %{
    total_time: ["10 min", "20 min", "30 min", "45 min", "1h", "+1h"],
    level: ["Très facile", "Facile", "Moyenne", "Difficile"],
    budget: ["Bon marché", "Moyen", "Assez cher"]
  }
  @default_values %{
    total_time: "30 min",
    level: "Facile",
    budget: "Bon marché"
  }

  schema "recipes" do
    field :content, :string
    field :title, :string
    field :total_time, :string
    field :level, :string
    field :budget, :string

    timestamps()
  end

  @doc false
  def changeset(%Recipe{} = recipe, attrs) do
    recipe
    |> cast(attrs, [:title, :content, :total_time, :level, :budget])
    |> validate_required([:title, :content, :total_time, :level, :budget])
    |> validate_length(:content, min: 10)
    |> validate_inclusion(:total_time, @options[:total_time])
    |> validate_inclusion(:level, @options[:level])
    |> validate_inclusion(:budget, @options[:budget])
  end

  def options(), do: @options
  def default_values(), do: @default_values
end
