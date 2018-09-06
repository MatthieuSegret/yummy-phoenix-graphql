defmodule YummyWeb.Arc.Storage.Local do
  alias Arc.Storage.Local

  def put(definition, version, {file, scope}) do
    Local.put(definition, version, {file, scope})
  end

  def delete(definition, version, file_and_scope) do
    Local.delete(definition, version, file_and_scope)
  end

  def url(definition, version, file_and_scope, options \\ []) do
    url = Local.url(definition, version, file_and_scope, options)
    Path.join(YummyWeb.Endpoint.url(), url)
  end
end
