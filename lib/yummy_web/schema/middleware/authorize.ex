defmodule YummyWeb.Schema.Middleware.Authorize do
  @behaviour Absinthe.Middleware
  alias Yummy.Accounts.User

  def call(resolution, _config) do
    case resolution.context do
      %{current_user: %User{}} -> resolution
      _ -> resolution |> Absinthe.Resolution.put_result({:error, "unauthorized"})
    end
  end
end
