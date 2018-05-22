defmodule YummyWeb.PageController do
  use YummyWeb, :controller

  def index(conn, _params) do
    html(conn, File.read!("client/build/index.html"))
  end
end
