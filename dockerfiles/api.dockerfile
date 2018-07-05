# Stage 1 - the build process
FROM elixir:1.6.5-alpine as build

WORKDIR /app

ENV MIX_ENV=prod

RUN apk add --no-cache build-base git && \
  mix local.rebar --force && \
  mix local.hex --force

COPY mix.exs mix.lock ./
COPY rel ./rel
COPY config ./config
COPY lib ./lib
COPY priv ./priv

RUN mix do deps.get --only $MIX_ENV, deps.compile && \
  mix phx.digest && \
  mix release --env=$MIX_ENV --verbose
RUN mv $(ls -d _build/prod/rel/yummy/releases/*/yummy.tar.gz) ./

# Stage 2 - the production environment
FROM alpine:3.6

WORKDIR /opt/app/

# we need bash and openssl for Phoenix
RUN apk add --no-cache bash openssl imagemagick

ENV MIX_ENV=prod \
  PORT=4000 \
  HOST=localhost \
  REPLACE_OS_VARS=true \
  SHELL=/bin/bash

COPY --from=build /app/yummy.tar.gz ./
RUN tar -xzf yummy.tar.gz

EXPOSE $PORT

ENTRYPOINT ["/opt/app/bin/yummy"]
CMD ["foreground"]