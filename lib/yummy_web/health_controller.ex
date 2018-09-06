defmodule YummyWeb.HealthController do
  use Phoenix.Controller

  def healthz(conn, _params) do
    text(conn, "ok")
  end
end
