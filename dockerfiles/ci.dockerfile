FROM elixir:1.6.5-alpine

RUN apk add --no-cache build-base git

RUN apk add --no-cache nodejs && \
  npm rebuild node-sass

ENV API_HOST=localhost:4000

# Install rebar and hex
RUN mix local.rebar --force && \
  mix local.hex --force

# Install imagemagick
RUN apk add --no-cache imagemagick

# Install fakeS3
RUN apk add --no-cache ruby && \
  gem install --no-ri --no-rdoc fakes3

# Install chromedriver
RUN apk add --no-cache udev chromium chromium-chromedriver xvfb