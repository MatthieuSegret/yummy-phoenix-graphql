defmodule YummyWeb.Integrations.EditUserProfileTest do
  use YummyWeb.IntegrationCase, async: false

  setup do
    user = insert(:user)
    {:ok, %{user: user}}
  end

  test "when user edit his profile", %{session: session, user: user} do
    session
    |> user_sign_in(user: user)
    |> visit("/users/profile/edit")
    |> assert_eq(text_field("Nom"), value: user.name)
    |> assert_eq(css("#email"), value: user.email)
    |> fill_in(text_field("Nom"), with: "Jose")
    |> fill_in(text_field("Email"), with: "jose@yummy.com")
    |> click(button("Mise à jour"))
    |> assert_eq(notice_msg(), text: "Votre profil a bien été mis à jour")

    user = User |> Repo.get!(user.id)
    assert user.name == "Jose"
    assert user.email == "jose@yummy.com"
  end

  test "when user cancel his account", %{session: session, user: user} do
    path =
      session
      |> user_sign_in(user: user)
      |> visit("/users/profile/edit")
      |> take_screenshot()
      |> disable_alert()
      |> click(css(".cancel-account a"))
      # |> assert_eq(notice_msg(), text: "Votre compte a bien été supprimé. Nous espérons vous revoir bientôt !")
      |> assert_eq(css(".header .navbar-end > .navbar-item:first-child"), text: "S'inscrire")
      |> current_path()

    assert path == "/"
    assert User |> Repo.get(user.id) == nil
  end
end
