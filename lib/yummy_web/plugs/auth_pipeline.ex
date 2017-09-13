defmodule YummyWeb.Plugs.AuthPipeline do
  use Guardian.Plug.Pipeline, otp_app: :yummy,
    module: YummyWeb.Guardian,
    error_handler: YummyWeb.Plugs.AuthErrorHandler

  plug Guardian.Plug.VerifyHeader
  plug Guardian.Plug.LoadResource, allow_blank: true
end