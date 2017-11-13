defmodule Yummy.Recipes.Recipe do
  use Ecto.Schema
  use Arc.Ecto.Schema
  import Ecto.Changeset
  alias Yummy.Recipes.{Comment, Recipe}
  alias Yummy.Accounts.User

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
    field :image_url, Yummy.ImageUploader.Type
    field :remove_image, :boolean, virtual: true
    field :uuid, :string
    belongs_to :author, User, foreign_key: :user_id
    has_many :comments, Comment

    timestamps()
  end

  @doc false
  def changeset(%Recipe{} = recipe, attrs) do
    attributes = case attrs[:image] do
      %Plug.Upload{} -> Map.merge(attrs, %{image_url: attrs[:image]})
      _ -> attrs
    end

    recipe
    |> cast(attributes, [:title, :content, :total_time, :level, :budget, :uuid, :remove_image])
    |> check_uuid
    |> cast_attachments(attributes, [:image_url])
    |> validate_required([:title, :content, :total_time, :level, :budget, :uuid])
    |> validate_length(:content, min: 10)
    |> validate_inclusion(:total_time, @options[:total_time])
    |> validate_inclusion(:level, @options[:level])
    |> validate_inclusion(:budget, @options[:budget])
    |> foreign_key_constraint(:user_id)
  end

  def options(), do: @options
  def default_values(), do: @default_values

  defp check_uuid(changeset) do
    if get_field(changeset, :uuid) == nil do
      force_change(changeset, :uuid, Ecto.UUID.generate())
    else
      changeset
    end
  end
end
