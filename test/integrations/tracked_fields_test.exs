defmodule YummyWeb.Integrations.TrackedFieldsTest do
  use YummyWeb.IntegrationCase, async: true

  setup do
    user = insert(:user)
    {:ok, %{user: user}}
  end

  describe "tracked fields are updated" do
    test "with first sign in", %{session: session, user: user} do
      session |> user_sign_in(user: user)
      u = User |> Repo.get(user.id)

      assert u.current_sign_in_at
      refute u.last_sign_in_at
      assert u.current_sign_in_ip == "127.0.0.1"
      refute u.last_sign_in_ip
      assert u.sign_in_count == 1
    end

    test "with second sign in", %{session: session, user: user} do
      session
      |> user_sign_in(user: user)
      |> click(link("Se déconnecter"))
      |> user_sign_in(user: user)
      u = User |> Repo.get(user.id)

      assert u.current_sign_in_at
      assert u.last_sign_in_at
      assert u.current_sign_in_ip == "127.0.0.1"
      refute u.last_sign_in_ip
      assert u.sign_in_count == 2
    end

    test "with sign up", %{session: session} do
      current_session = session
      |> visit("/users/signup")
      |> fill_in(text_field("Nom"), with: "Jose")
      |> fill_in(text_field("Email"), with: "jose@yummy.com")
      |> fill_in(text_field("Mot de passe"), with: "12341234")
      |> fill_in(text_field("Confirmer votre mot de passe"), with: "12341234")
      |> click(button("S'inscrire"))
      |> assert_eq(css("h1.title"), text: "Bienvenue sur Yummy !")

      user = User |> Repo.get_by(email: "jose@yummy.com")

      current_session
      |> fill_in(css("input[name='code']"), with: user.confirmation_code)
      |> click(button("Valider"))
      |> assert_eq(notice_msg(), text: "Votre compte a été validé.")
      
      u = User |> Repo.get_by(email: "jose@yummy.com")

      assert u.current_sign_in_at
      refute u.last_sign_in_at
      assert u.current_sign_in_ip == "127.0.0.1"
      refute u.last_sign_in_ip
      assert u.sign_in_count == 1
    end
  end
end