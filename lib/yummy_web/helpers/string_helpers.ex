defmodule YummyWeb.Helpers.StringHelpers do
  def description(text) do
    text
    |> truncate(length: 150)
    |> String.replace(~r/\r|\n|\t/, " ")
    |> String.replace(~r/#|\*/, "")
  end

  def truncate(text, length: length) do
    "#{text |> String.slice(0..length)}..."
  end

  def present?(nil), do: false
  def present?(string) do
    string |> String.trim() |> String.length() > 0
  end
end