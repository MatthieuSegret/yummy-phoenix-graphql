defmodule YummyWeb.Plugs.Context do
  @behaviour Plug

  alias YummyWeb.Helpers.StringHelpers  
  alias Yummy.Accounts.User
  alias Yummy.Repo
  import Plug.Conn

  def init(opts), do: opts

  def call(conn, _) do
    context = build_context(conn)
    put_private(conn, :absinthe, %{context: context})
  end

  defp build_context(conn) do
    with ["Bearer " <> token] <- get_req_header(conn, "authorization"),
      true <- StringHelpers.present?(token),
      {:ok, user} <- get_user(token)
    do
      %{current_user: user}
    else
      _ -> %{}
    end
  end

  defp get_user(nil), do: :error
  defp get_user(token) do
    user = User |> Repo.get_by(access_token: token)
    {:ok, user}
  end
end