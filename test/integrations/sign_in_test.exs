defmodule YummyWeb.Integrations.SignInTest do
  use YummyWeb.IntegrationCase, async: false
  use Bamboo.Test, shared: true

  setup do
    user = insert(:user)
    {:ok, %{user: user}}
  end

  describe "when user is sign in" do
    test "with successful", %{session: session, user: user} do
      path =
        session
        |> user_sign_in(user: user)
        |> assert_eq(notice_msg(), text: "Vous êtes bien connecté(e)")
        |> assert_eq(signed_in_user(), text: user.name)
        |> current_path()

      assert path == "/"
    end

    test "with invalid input", %{session: session} do
      path =
        session
        |> visit("/users/signin")
        |> fill_in(text_field("Email"), with: "invalid")
        |> fill_in(text_field("Mot de passe"), with: "invalid")
        |> click(button("Se connecter"))
        |> assert_eq(error_msg(), text: "Email ou mot de passe invalide")
        |> assert_eq(text_field("Mot de passe"), text: "")
        |> current_path()

      assert path == "/users/signin"
    end
  end

  test "with unconfirmed account", %{session: session} do
    unconfirmed_user = insert(:user, confirmed_at: nil)

    current_session =
      session
      |> visit("/users/signin")
      |> fill_in(text_field("Email"), with: unconfirmed_user.email)
      |> fill_in(text_field("Mot de passe"), with: unconfirmed_user.password)
      |> click(button("Se connecter"))
      |> assert_eq(css("h1.title"), text: "Valider votre compte")
      |> assert_eq(css(".confirmation-instruction > p > strong"), text: unconfirmed_user.email)

    user = User |> last() |> Repo.one()

    assert current_path(current_session) =~ ~r/\/users\/confirmation-needed\//

    assert_email_delivered_with(
      subject: "Nouveau code pour valider votre compte",
      text_body: ~r/#{user.confirmation_code}/,
      html_body: ~r/#{user.confirmation_code}/
    )

    path =
      current_session
      |> fill_in(css("input[name='code']"), with: user.confirmation_code)
      |> click(button("Valider"))
      |> assert_eq(notice_msg(), text: "Votre compte a été validé.")
      |> assert_eq(signed_in_user(), text: user.name)
      |> current_path()

    assert path == "/"
  end

  describe "when user is sign out" do
    test "with successful", %{session: session, user: user} do
      session
      |> user_sign_in(user: user)
      |> click(link("Se déconnecter"))
      |> assert_eq(css(".header .navbar-end > .navbar-item:first-child"), text: "S'inscrire")
    end
  end
end
