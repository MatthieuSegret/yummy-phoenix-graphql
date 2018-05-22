defmodule YummyWeb.Router do
  use YummyWeb, :router
  use Plug.ErrorHandler

  pipeline :browser do
    plug(:accepts, ["html"])
  end

  pipeline :api do
    plug(:accepts, ["json"])
    plug(YummyWeb.Plugs.Context)
  end

  scope "/" do
    pipe_through(:api)

    forward("/graphql", Absinthe.Plug, schema: YummyWeb.Schema)

    if Mix.env() == :dev do
      forward("/graphiql", Absinthe.Plug.GraphiQL, schema: YummyWeb.Schema, socket: YummyWeb.UserSocket)
      forward("/emails", Bamboo.SentEmailViewerPlug)
    end
  end

  scope "/", YummyWeb do
    pipe_through(:browser)

    get("/*path", PageController, :index)
  end

  defp handle_errors(_conn, %{reason: %Ecto.NoResultsError{}}), do: true
  defp handle_errors(_conn, %{reason: %Phoenix.Router.NoRouteError{}}), do: true

  defp handle_errors(conn, %{kind: kind, reason: reason, stack: stacktrace}) do
    headers = Enum.into(conn.req_headers, %{})
    reason = Map.delete(reason, :assigns)

    Rollbax.report(kind, reason, stacktrace, %{}, %{
      "request" => %{
        "url" => "#{conn.scheme}://#{conn.host}#{conn.request_path}",
        "user_ip" => Map.get(headers, "x-forwarded-for"),
        "method" => conn.method,
        "headers" => headers,
        "params" => conn.params
      }
    })
  end
end
