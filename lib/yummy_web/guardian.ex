defmodule YummyWeb.Guardian do
  use Guardian, otp_app: :yummy
  alias Yummy.Repo
  alias Yummy.Accounts.User

  def subject_for_token(%User{} = user, _claims) do
    {:ok, to_string(user.id)}
  end

  def subject_for_token(_, _) do
    {:error, "Unknown resource type"}
  end

  def resource_from_claims(%{"sub" => id}) do
    {:ok, User |> Repo.get!(id)}
  end
  def resource_from_claims(_claims) do
    {:error, "Unknown resource type"}
  end
end