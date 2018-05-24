defmodule YummyWeb.IntegrationCase do
  use ExUnit.CaseTemplate
  use Wallaby.DSL
  import Wallaby.Query, only: [css: 1, text_field: 1, button: 1]

  using do
    quote do
      use Wallaby.DSL

      alias Yummy.Repo
      alias Yummy.Accounts.User
      import Ecto
      import Ecto.Changeset
      import Ecto.Query
      import Wallaby.Query
      import Yummy.Factory
      import YummyWeb.IntegrationCase
    end
  end

  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Yummy.Repo)

    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(Yummy.Repo, {:shared, self()})
    end

    metadata = Phoenix.Ecto.SQL.Sandbox.metadata_for(Yummy.Repo, self())
    {:ok, session} = Wallaby.start_session(metadata: metadata)
    {:ok, session: session}
  end

  @dialyzer {:nowarn_function, user_sign_in: 2}
  @spec user_sign_in(Session.t(), user: User) :: Session.t()
  def user_sign_in(session, user: user) do
    session
    |> visit("/users/signin")
    |> fill_in(text_field("Email"), with: user.email)
    |> fill_in(text_field("Mot de passe"), with: user.password)
    |> click(button("Se connecter"))
    |> assert_has(css(".notification.is-primary"))
  end

  def signed_in_user(), do: css(".header .navbar-end > .navbar-item:first-child")
  def notice_msg(), do: css(".notification.is-primary")
  def error_msg(), do: css(".notification.is-danger")

  def assert_eq(session, query, text: expected_value) do
    assert find_text(session, query) == expected_value
    session
  end

  def assert_eq(session, query, value: expected_value) do
    assert find_value(session, query) == expected_value
    session
  end

  def find_text(session, query) do
    session
    |> find(query)
    |> Element.text()
  end

  def find_value(session, query) do
    session
    |> find(query)
    |> Element.value()
  end

  def disable_alert(session) do
    execute_script(session, "window.confirm = () => { return true; };")
    execute_script(session, "window.alert = () => { return true; };")
    session
  end
end
