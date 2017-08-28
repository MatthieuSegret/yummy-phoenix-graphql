defmodule YummyWeb.Router do
  use YummyWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/" do
    pipe_through :api

    forward "/graphql", Absinthe.Plug, schema: YummyWeb.Graph.Schema
    
    if Mix.env == :dev do
      forward "/graphiql", Absinthe.Plug.GraphiQL, schema: YummyWeb.Graph.Schema
    end
  end
end
