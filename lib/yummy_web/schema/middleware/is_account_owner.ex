defmodule YummyWeb.Schema.Middleware.IsAccountOwner do
  @behaviour Absinthe.Middleware
  alias Yummy.Accounts.User

  def call(%{context: %{current_user: user = %User{}}, source: source} = resolution, _config) do
    if user.id == source.id do
      resolution
    else
      unauthorize(resolution)
    end
  end

  def call(resolution, _config) do
    unauthorize(resolution)
  end

  defp unauthorize(resolution) do
    resolution |> Absinthe.Resolution.put_result({:ok, "unauthorize"})
  end
end
