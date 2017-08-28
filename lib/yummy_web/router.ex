defmodule YummyWeb.Router do
  use YummyWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", YummyWeb do
    pipe_through :api
  end
end
