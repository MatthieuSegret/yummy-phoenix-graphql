defmodule Yummy.Repo do
  use Ecto.Repo, otp_app: :yummy
  import Ecto.Query, warn: false
  @per_page 5

  @doc """
  Dynamically loads the repository url from the
  DATABASE_URL environment variable.
  """
  def init(_, opts) do
    {:ok, Keyword.put(opts, :url, System.get_env("DATABASE_URL"))}
  end

  def count(query) do
    one(from(r in query, select: count("*")))
  end

  def paginate(query, offset) do
    from(r in query, offset: ^offset, limit: @per_page)
  end

  def fetch(query) do
    case all(query) do
      [] -> {:error, query}
      [obj] -> {:ok, obj}
    end
  end
end
