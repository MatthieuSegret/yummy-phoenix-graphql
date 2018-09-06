FROM elixir:1.6.5-alpine

WORKDIR /app
ENV MIX_ENV=prod

RUN apk add --no-cache build-base git && \
  mix local.rebar --force && \
  mix local.hex --force

COPY mix.exs mix.lock ./

RUN mix deps.get --only $MIX_ENV && \
  mix compile