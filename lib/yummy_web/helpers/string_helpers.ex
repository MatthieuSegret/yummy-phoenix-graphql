defmodule YummyWeb.Helpers.StringHelpers do
  @spec description(String.t()) :: String.t()
  def description(text) do
    text
    |> truncate(length: 180)
    |> String.replace(~r/\r|\n|\t/, " ")
    |> String.replace(~r/#|\*/, "")
  end

  @spec truncate(String.t(), length: integer()) :: String.t()
  def truncate(text, length: length) do
    "#{text |> String.slice(0..length)}..."
  end

  @spec present?(String.t()) :: boolean()
  def present?(nil), do: false

  def present?(string) do
    string |> String.trim() |> String.length() > 0
  end
end
