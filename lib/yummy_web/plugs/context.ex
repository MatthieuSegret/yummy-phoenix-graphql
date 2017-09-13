defmodule YummyWeb.Plugs.Context do
  @behaviour Plug

  import Plug.Conn

  def init(opts), do: opts

  def call(conn, _) do
    user = Guardian.Plug.current_resource(conn)
    put_private(conn, :absinthe, %{context: %{current_user: user}})
  end
end