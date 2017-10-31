alias Kronky.ValidationMessage

defmodule YummyWeb.Helpers.ValidationMessageHelpers do
  def generic_message(message) when is_binary(message) do
    %ValidationMessage{
      code: :unknown, field: "base", template: message, message: message, options: []
    }
  end
end