defmodule Yummy.Mixfile do
  use Mix.Project

  def project do
    [
      app: :yummy,
      version: "0.0.1",
      elixir: "~> 1.4",
      elixirc_paths: elixirc_paths(Mix.env),
      compilers: [:phoenix, :gettext] ++ Mix.compilers,
      start_permanent: Mix.env == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {Yummy.Application, []},
      extra_applications: [:logger, :runtime_tools, :absinthe, :absinthe_plug]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_),     do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:phoenix, "~> 1.3.0"},
      {:phoenix_pubsub, "~> 1.0"},
      {:phoenix_ecto, "~> 3.2"},
      {:postgrex, ">= 0.0.0"},
      {:gettext, "~> 0.14.0"},
      {:cowboy, "~> 1.1.2"},
      {:absinthe, "~> 1.4.7", override: true},
      {:absinthe_plug, "~> 1.4.2"},
      {:absinthe_phoenix, "~> 1.4.2"},
      {:dataloader, "~> 1.0.1"},
      {:poison, "~> 3.1.0"},
      {:cors_plug, "~> 1.5.0"},
      {:kronky, "~> 0.4.0"},
      {:comeonin, "~> 4.0.3"},
      {:bcrypt_elixir, "~> 1.0.5"},
      {:secure_random, "~> 0.5"},
      {:arc, "~> 0.8.0"},
      {:ex_aws, "~> 1.1.3"},
      {:hackney, "~> 1.8.0", override: true},
      {:sweet_xml, "~> 0.6"},
      {:arc_ecto, "~> 0.7.0"},
      {:wallaby, "~> 0.19.2", [runtime: false, only: :test]},
      {:ex_machina, "~> 2.1", only: :test},
      {:faker, "~> 0.9", only: :test}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to create, migrate and run the seeds file at once:
  #
  #     $ mix ecto.setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      "test": ["ecto.create --quiet", "ecto.migrate", "test"]
    ]
  end
end
