defmodule YummyWeb.Helpers.ApplicationHelpers do
  def description(text) do
    text
    |> truncate(length: 180)
    |> String.replace(~r/\r|\n|\t/, " ")
    |> String.replace(~r/#|\*/, "")
  end

  def truncate(text, length: length) do
    text
    |> String.slice(0..length)
    |> String.replace(~r/\s(.)*$/, "...")
  end
end