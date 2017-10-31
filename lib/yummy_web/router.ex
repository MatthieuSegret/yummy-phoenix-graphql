defmodule YummyWeb.Router do
  use YummyWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug YummyWeb.Plugs.Context
  end


  scope "/" do
    pipe_through :api

    forward "/graphql", Absinthe.Plug, schema: YummyWeb.Graph.Schema

    if Mix.env == :dev do
      forward "/graphiql", Absinthe.Plug.GraphiQL, schema: YummyWeb.Graph.Schema
    end
  end

  scope "/", YummyWeb do
    pipe_through :browser

    get "/*path", PageController, :index
  end
end
