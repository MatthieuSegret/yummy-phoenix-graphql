defmodule YummyWeb.Graph.Types.RecipeType do
  use Absinthe.Schema.Notation

  @desc "A Recipe with title and content"
  object :recipe do
    field :id, :id
    field :title, :string
    field :content, :string
  end
end