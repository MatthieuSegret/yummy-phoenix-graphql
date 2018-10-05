defmodule Yummy.Application do
  use Application

  alias Yummy.{
    PhoenixInstrumenter,
    PipelineInstrumenter,
    PrometheusExporter,
    RepoInstrumenter
  }

  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec

    # Prometheus
    require Prometheus.Registry
    PhoenixInstrumenter.setup()
    PipelineInstrumenter.setup()
    RepoInstrumenter.setup()

    if :os.type() == {:unix, :linux} do
      Prometheus.Registry.register_collector(:prometheus_process_collector)
    end

    PrometheusExporter.setup()

    # Define workers and child supervisors to be supervised
    children = [
      # Start the Ecto repository
      supervisor(Yummy.Repo, []),
      # Start the endpoint when the application starts
      supervisor(YummyWeb.Endpoint, []),
      # Start your own worker by calling: Yummy.Worker.start_link(arg1, arg2, arg3)
      # worker(Yummy.Worker, [arg1, arg2, arg3]),
      supervisor(Absinthe.Subscription, [YummyWeb.Endpoint])
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Yummy.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    YummyWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
