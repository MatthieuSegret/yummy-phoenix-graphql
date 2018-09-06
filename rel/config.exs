# Import all plugins from `rel/plugins`
# They can then be used by adding `plugin MyPlugin` to
# either an environment, or release definition, where
# `MyPlugin` is the name of the plugin module.
Path.join(["rel", "plugins", "*.exs"])
|> Path.wildcard()
|> Enum.map(&Code.eval_file(&1))

use Mix.Releases.Config,
  default_release: :default,
  default_environment: :prod

environment :prod do
  set(include_erts: true)
  set(include_src: false)
  set(cookie: :";W^JBe|r10%%>?@&Y8XgVeZwH9kJ?w?bO/bl1!gjiD(P.<;2IkIz,[o<Mox:<.qg")

  set(
    commands: [
      migrate: "rel/commands/migrate.sh",
      seeds: "rel/commands/seeds.sh"
    ]
  )
end

release :yummy do
  set(version: current_version(:yummy))
  set(vm_args: "rel/vm.args")

  set(
    applications: [
      :runtime_tools
    ]
  )
end
