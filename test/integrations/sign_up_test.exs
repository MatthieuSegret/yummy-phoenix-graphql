defmodule YummyWeb.Integrations.SignUpTest do
  use YummyWeb.IntegrationCase, async: false
  use Bamboo.Test, shared: true

  alias Yummy.Accounts.User

  describe "when user is sign up" do
    test "with successful", %{session: session} do
      current_session =
        session
        |> visit("/users/signup")
        |> fill_in(text_field("Nom"), with: "Jose")
        |> fill_in(text_field("Email"), with: "jose@yummy.com")
        |> fill_in(text_field("Mot de passe"), with: "12341234")
        |> fill_in(text_field("Confirmer votre mot de passe"), with: "12341234")
        |> click(button("S'inscrire"))
        |> assert_eq(css("h1.title"), text: "Bienvenue sur Yummy !")
        |> assert_eq(css(".confirmation-instruction > p > strong"), text: "jose@yummy.com")

      user = User |> last() |> Repo.one()

      assert current_path(current_session) == "/users/welcome/jose%40yummy.com"

      assert_email_delivered_with(
        subject: "Bienvenue sur Yummy !",
        text_body: ~r/#{user.confirmation_code}/,
        html_body: ~r/#{user.confirmation_code}/
      )

      path =
        current_session
        |> fill_in(css("input[name='code']"), with: user.confirmation_code)
        |> click(button("Valider"))
        |> assert_eq(notice_msg(), text: "Votre compte a été validé.")
        |> assert_eq(signed_in_user(), text: "Jose")
        |> current_path()

      assert path == "/"
    end

    test "with invalid input", %{session: session} do
      path =
        session
        |> visit("/users/signup")
        |> fill_in(text_field("Nom"), with: "Jose")
        |> fill_in(text_field("Email"), with: "joseyummy.com")
        |> fill_in(text_field("Mot de passe"), with: "1234")
        |> fill_in(text_field("Confirmer votre mot de passe"), with: "123")
        |> click(button("S'inscrire"))
        |> assert_eq(error_msg(), text: "Des erreurs ont eu lieu, veuillez vérifier :")
        |> assert_eq(css(".label[for='email'] ~ p.help.is-danger"), text: "n'est pas au bon format")
        |> assert_eq(css(".label[for='password'] ~ p.help.is-danger"), text: "est trop court (au moins 6 caractères)")
        |> assert_eq(css(".label[for='passwordConfirmation'] ~ p.help.is-danger"), text: "Ne correspond pas")
        |> assert_eq(text_field("Mot de passe"), text: "")
        |> assert_eq(text_field("Confirmer votre mot de passe"), text: "")
        |> current_path()

      assert path == "/users/signup"
    end
  end
end
