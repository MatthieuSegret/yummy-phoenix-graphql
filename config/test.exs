use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :yummy, YummyWeb.Endpoint,
  http: [port: 4001],
  server: true

config :yummy, :sql_sandbox, true

config :wallaby,
  driver: Wallaby.Experimental.Chrome,
  # screenshot_on_failure: true,
  screenshot_dir: "test/screenshots"

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :yummy, Yummy.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: System.get_env("DATABASE_POSTGRESQL_USERNAME") || "postgres",
  password: System.get_env("DATABASE_POSTGRESQL_PASSWORD") || "postgres",
  database: "yummy_graphql_test",
  hostname: System.get_env("DATABASE_HOST") || "localhost",
  port: System.get_env("DATABASE_PORT") || 5432,
  pool: Ecto.Adapters.SQL.Sandbox

# Configures Bamboo
config :yummy, Yummy.Mailer, adapter: Bamboo.TestAdapter

config :rollbax,
  access_token: "",
  environment: "test",
  enabled: false

config :ex_aws,
  access_key_id: ["fake", :instance_role],
  secret_access_key: ["fake", :instance_role],
  region: "fakes3"

config :ex_aws, :s3,
  scheme: "http://",
  host: "localhost",
  port: 4567

config :arc,
  storage: Arc.Storage.S3,
  asset_host: "http://localhost:4567/yummy-phoenix-graphql",
  bucket: "yummy-phoenix-graphql"
