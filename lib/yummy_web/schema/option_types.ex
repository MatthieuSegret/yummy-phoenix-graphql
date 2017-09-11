defmodule YummyWeb.Schema.OptionTypes do
  use Absinthe.Schema.Notation

  @desc "A option for select field in a form"
  object :option do
    field :value, :string
    field :label, :string
  end
end