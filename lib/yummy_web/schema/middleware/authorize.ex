import YummyWeb.Helpers.ValidationMessageHelpers

defmodule YummyWeb.Schema.Middleware.Authorize do
  @behaviour Absinthe.Middleware

  def call(resolution, role) do 
    case resolution.context do
      %{current_user: %{} = current_user} -> resolution
      _ ->
        message = "Vous devez vous connecter ou vous inscrire pour continuer."
        resolution |> Absinthe.Resolution.put_result({:ok, generic_message(message)})
    end
  end
end