defmodule Yummy.Helpers.DateHelpers do
  def expired?(nil, _), do: true
  def expired?(datetime, opts) do
    not Timex.before?(Timex.now, shift(datetime, opts))
  end

  def shift(datetime, opts) do
    datetime
    |> NaiveDateTime.to_erl
    |> Timex.to_datetime
    |> Timex.shift(opts)
  end
end