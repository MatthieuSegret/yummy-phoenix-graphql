defmodule Yummy.PipelineInstrumenter do
  @moduledoc """
  Instrumentation for the entire plug pipeline.
  """
  use Prometheus.PlugPipelineInstrumenter
  @spec label_value(:request_path, Plug.Conn.t()) :: binary
  def label_value(:request_path, conn) do
    conn.request_path
  end
end
