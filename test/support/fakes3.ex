
defmodule YummyWeb.FakeS3 do
  @moduledoc """
    FakeS3 need to be started to simulate Amazon S3
    To Start FakeS3 :
    ```
      $ fakes3 -r $HOME/.s3bucket -p 4567&
    ```
  """

  @doc """
    Check if FakeS3 is started
  """
  def check_fakes3 do
    case :gen_tcp.connect('localhost', 4567, []) do
      {:ok, socket} ->
        :gen_tcp.close(socket)
      {:error, reason} ->
        Mix.raise "Cannot connect to FakeS3" <>
                  " (http://localhost:4567):" <>
                  " #{:inet.format_error(reason)}"
    end
  end  
end