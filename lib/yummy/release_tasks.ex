defmodule Yummy.ReleaseTasks do
  @start_apps [
    :crypto,
    :ssl,
    :postgrex,
    :ecto,
    :ex_aws,
    :arc,
    :timex
  ]

  def myapp, do: :yummy

  def repos, do: Application.get_env(myapp(), :ecto_repos, [])

  def seed do
    # Setup the Repo(s) for myapp
    setup()

    # Run seed script
    Enum.each(repos(), &run_seeds_for/1)

    # Signal shutdown
    IO.puts("Loading seeds success!")
    :init.stop()
  end

  def migrate do
    # Setup the Repo(s) for myapp
    setup()

    # Run migrations
    Enum.each(repos(), &run_migrations_for/1)

    # Signal shutdown
    IO.puts("Migrating success!")
    :init.stop()
  end

  def priv_dir(app), do: "#{:code.priv_dir(app)}"

  defp setup do
    me = myapp()

    IO.puts("Loading #{me}..")
    # Load the code for myapp, but don't start it
    :ok = Application.load(me)

    IO.puts("Starting dependencies..")
    # Start apps necessary for executing migrations
    Enum.each(@start_apps, &Application.ensure_all_started/1)

    # Start the Repo(s) for myapp
    IO.puts("Starting repos..")
    Enum.each(repos(), & &1.start_link(pool_size: 1))
  end

  defp run_migrations_for(repo) do
    app = Keyword.get(repo.config, :otp_app)
    IO.puts("Running migrations for #{app}")
    Ecto.Migrator.run(repo, migrations_path(repo), :up, all: true)
  end

  def run_seeds_for(repo) do
    # Run the seed script if it exists
    seed_script = seeds_path(repo)

    if File.exists?(seed_script) do
      IO.puts("Running seed script..")
      Code.eval_file(seed_script)
    end
  end

  def migrations_path(repo), do: priv_path_for(repo, "migrations")

  def seeds_path(repo), do: priv_path_for(repo, "seeds.exs")

  def priv_path_for(repo, filename) do
    app = Keyword.get(repo.config, :otp_app)
    repo_underscore = repo |> Module.split() |> List.last() |> Macro.underscore()
    Path.join([priv_dir(app), repo_underscore, filename])
  end
end
