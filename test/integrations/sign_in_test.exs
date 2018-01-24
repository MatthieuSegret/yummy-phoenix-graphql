defmodule YummyWeb.Integrations.SignInTest do
  use YummyWeb.IntegrationCase, async: true

  setup do
    user = insert(:user)
    {:ok, %{user: user }}
  end

  describe "when user is sign in" do
    test "with successful", %{session: session, user: user} do
      path = session
      |> user_sign_in(user: user)

      |> assert_eq(notice_msg(), text: "Vous êtes bien connecté(e)")
      |> assert_eq(signed_in_user(), text: user.name)
      |> current_path()

      assert path == "/"
    end

    test "with invalid input", %{session: session} do 
      path = session
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

  describe "when user is sign out" do
    test "with successful", %{session: session, user: user} do
      session
      |> user_sign_in(user: user)
      |> click(link("Se déconnecter"))
      |> assert_eq(css(".header .navbar-end > .navbar-item:first-child"), text: "S'inscrire")
    end
  end
end