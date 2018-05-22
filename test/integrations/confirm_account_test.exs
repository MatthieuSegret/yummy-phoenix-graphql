defmodule YummyWeb.Integrations.ConfirmAccountTest do
  use YummyWeb.IntegrationCase, async: false
  use Bamboo.Test, shared: true

  alias Yummy.Repo
  alias Yummy.Accounts.User

  setup do
    user =
      insert(
        :user,
        confirmed_at: nil,
        confirmation_code: "123123",
        confirmation_sent_at: Timex.now()
      )

    confirmation_url = "/users/confirmation-needed/#{URI.encode(user.email)}"
    {:ok, %{user: user, confirmation_url: confirmation_url}}
  end

  describe "when user confirm account" do
    test "with successful", %{session: session, user: user, confirmation_url: confirmation_url} do
      path =
        session
        |> visit(confirmation_url)
        |> fill_in(css("input[name='code']"), with: user.confirmation_code)
        |> click(button("Valider"))
        |> assert_eq(notice_msg(), text: "Votre compte a été validé.")
        |> assert_eq(signed_in_user(), text: user.name)
        |> current_path()

      assert path == "/"
    end

    test "with invalid format", %{session: session, confirmation_url: confirmation_url} do
      path =
        session
        |> visit(confirmation_url)
        |> fill_in(css("input[name='code']"), with: "invalid")
        |> click(button("Valider"))
        |> assert_eq(error_msg(), text: "Le code doit être composé de 6 chiffres.")
        |> current_path()

      assert path == confirmation_url
    end

    test "with wrong code", %{session: session, confirmation_url: confirmation_url} do
      path =
        session
        |> visit(confirmation_url)
        |> fill_in(css("input[name='code']"), with: "987654")
        |> click(button("Valider"))
        |> assert_eq(error_msg(), text: "Ce code est invalide. Essayez avec un autre code.")
        |> current_path()

      assert path == confirmation_url
    end

    test "with expirated date", %{session: session} do
      user =
        insert(
          :user,
          confirmed_at: nil,
          confirmation_code: "123123",
          confirmation_sent_at: Timex.shift(Timex.now(), hours: -7)
        )

      confirmation_url = "/users/confirmation-needed/#{URI.encode(user.email)}"

      path =
        session
        |> visit(confirmation_url)
        |> fill_in(css("input[name='code']"), with: user.confirmation_code)
        |> click(button("Valider"))
        |> assert_eq(error_msg(), text: "Ce code est expiré. Veuillez en redemander un nouveau.")
        |> current_path()

      assert path == confirmation_url
    end

    test "with account already confirmed", %{session: session} do
      user = insert(:user)
      confirmation_url = "/users/confirmation-needed/#{URI.encode(user.email)}"

      path =
        session
        |> visit(confirmation_url)
        |> fill_in(css("input[name='code']"), with: "123123")
        |> click(button("Valider"))
        |> assert_eq(error_msg(), text: "Ce compte a déjà été validé. Vous pouvez vous connecter.")
        |> current_path()

      assert path == "/users/signin"
    end
  end

  describe "when user ask new code" do
    test "with successful", %{session: session, user: user, confirmation_url: confirmation_url} do
      current_session =
        session
        |> visit(confirmation_url)
        |> click(button("Renvoyer l'email"))
        |> assert_eq(notice_msg(), text: "L'email de confirmation a bien été renvoyé")

      assert current_path(current_session) == confirmation_url

      u = User |> Repo.get_by(email: user.email)

      assert_email_delivered_with(
        subject: "Nouveau code pour valider votre compte",
        text_body: ~r/#{u.confirmation_code}/,
        html_body: ~r/#{u.confirmation_code}/
      )

      assert u.confirmation_code
      assert u.confirmation_sent_at
      refute u.confirmed_at
    end

    test "with account already confirmed", %{session: session} do
      user = insert(:user)
      confirmation_url = "/users/confirmation-needed/#{URI.encode(user.email)}"

      path =
        session
        |> visit(confirmation_url)
        |> click(button("Renvoyer l'email"))
        |> assert_eq(error_msg(), text: "Ce compte a déjà été validé. Vous pouvez vous connecter.")
        |> current_path()

      assert path == "/users/signin"
    end
  end
end
