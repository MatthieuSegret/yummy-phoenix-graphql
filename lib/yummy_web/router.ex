defmodule YummyWeb.Router do
  use YummyWeb, :router

  pipeline :api do
    plug(:accepts, ["json"])
    plug(YummyWeb.Plugs.Context)
  end

  scope "/" do
    pipe_through(:api)

    get("/", YummyWeb.HealthController, :healthz)
    get("/healthz", YummyWeb.HealthController, :healthz)
    forward("/graphql", Absinthe.Plug, schema: YummyWeb.Schema)

    if Mix.env() == :dev do
      forward("/graphiql", Absinthe.Plug.GraphiQL, schema: YummyWeb.Schema, socket: YummyWeb.UserSocket)
      forward("/emails", Bamboo.SentEmailViewerPlug)
    end
  end
end
