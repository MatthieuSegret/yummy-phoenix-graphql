defmodule YummyWeb.Integrations.ChangePasswordTest do
  use YummyWeb.IntegrationCase, async: true

  describe "when user changes password" do
    setup do
      user = insert(:user)
      {:ok, %{user: user }}
    end

    test "with successful", %{session: session, user: user} do
      session
      |> user_sign_in(user: user)

      |> visit("/users/password/edit")
      |> fill_in(text_field("Mot de passe actuel"), with: user.password)
      |> fill_in(text_field("Nouveau mot de passe"), with: "123123")
      |> fill_in(text_field("Confirmer votre mot de passe"), with: "123123")
      |> click(button("Mise à jour"))
      |> assert_eq(notice_msg(), text: "Votre mot de passe a bien été mis à jour")

      |> click(link("Se déconnecter"))
      |> visit("/users/signin")
      |> fill_in(text_field("Email"), with: user.email)
      |> fill_in(text_field("Mot de passe"), with: "123123")
      |> click(button("Se connecter"))
 
      |> assert_eq(notice_msg(), text: "Vous êtes bien connecté(e)")
    end

    test "with invalid password", %{session: session, user: user} do 
      session
      |> user_sign_in(user: user)

      |> visit("/users/password/edit")
      |> fill_in(text_field("Mot de passe actuel"), with: "invalid")
      |> fill_in(text_field("Nouveau mot de passe"), with: "123123")
      |> fill_in(text_field("Confirmer votre mot de passe"), with: "123123")
      |> click(button("Mise à jour"))

      |> assert_eq(error_msg(), text: "Des erreurs ont eu lieu, veuillez vérifier :")
      |> assert_eq(css(".label[for='currentPassword'] ~ p.help.is-danger"), text: "Le mot de passe n'est pas valide")
      |> assert_eq(text_field("Mot de passe actuel"), text: "")
      |> assert_eq(text_field("Nouveau mot de passe"), text: "")
      |> assert_eq(text_field("Confirmer votre mot de passe"), text: "")
    end
  end
end