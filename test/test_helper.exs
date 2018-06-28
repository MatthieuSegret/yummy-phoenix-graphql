import YummyWeb.FakeS3, only: [check_fakes3: 0]

check_fakes3()

# start frontend server
:os.cmd(:"npm run test.server &")

Application.put_env(:wallaby, :base_url, "http://" <> (System.get_env("CLIENT_HOST") || "localhost:3000"))
{:ok, _} = Application.ensure_all_started(:ex_machina)
{:ok, _} = Application.ensure_all_started(:wallaby)

ExUnit.start()

Ecto.Adapters.SQL.Sandbox.mode(Yummy.Repo, :manual)
