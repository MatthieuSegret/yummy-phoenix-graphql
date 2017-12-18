defmodule Yummy.Recipes.Comment do
  use Ecto.Schema
  import Ecto.Changeset
  alias Yummy.Recipes.{Comment, Recipe}
  alias Yummy.Accounts.User


  schema "comments" do
    field :body, :string
    belongs_to :recipe, Recipe
    belongs_to :author, User, foreign_key: :user_id

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(%Comment{} = comment, attrs) do
    comment
    |> cast(attrs, [:body])
    |> validate_required([:body])
    |> foreign_key_constraint(:recipe_id)
    |> foreign_key_constraint(:user_id)
  end
end
