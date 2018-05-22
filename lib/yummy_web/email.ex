defmodule YummyWeb.Email do
  use Bamboo.Phoenix, view: YummyWeb.EmailView
  alias Yummy.Accounts.User

  @noreply "noreply@yummy.com"

  def welcome(%User{} = user) do
    new_email()
    |> to(user.email)
    |> from(@noreply)
    |> subject("Bienvenue sur Yummy !")
    |> assign(:user, user)
    |> render(:welcome)
  end

  def new_confirmation_code(%User{} = user) do
    new_email()
    |> to(user.email)
    |> from(@noreply)
    |> subject("Nouveau code pour valider votre compte")
    |> assign(:user, user)
    |> render(:new_confirmation_code)
  end
end
