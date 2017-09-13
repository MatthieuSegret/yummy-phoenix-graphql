# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :yummy,
  ecto_repos: [Yummy.Repo]

# Configures the endpoint
config :yummy, YummyWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "QvfN7ps5NsTx3Gz+TyYXH0vLB0JGNYxQZA3s5t7FunHZ9tENymuU1B70iHJpHRVK",
  render_errors: [view: YummyWeb.ErrorView, accepts: ~w(json)],
  pubsub: [name: Yummy.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :yummy, YummyWeb.Guardian,
  issuer: "Yummy",
  ttl: { 30, :days },
  secret_key: "GR9C6wl7EWVR8ZEz5la8X3X4pFzg7fFGu405/eBqbn4OJkPrjkcf1EYiRCI3pU2R"

config :yummy, YummyWeb.Gettext,
  default_locale: "fr"

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
