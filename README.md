# Yummy Phoenix GraphQL

This application can be used as **starter kit** if you want to get started building an app with **Phoenix**, **React**,
and **GraphQL**. This is a simple cooking recipe sharing application using ordinary features which can be found in most
web applications.

## Technologies

### Frontend

* [React](https://facebook.github.io/react) - A JavaScript library for building user interfaces. It introduces many
  great concepts, such as, Virtual DOM, Data flow, etc.
* [Create React App](https://github.com/facebookincubator/create-react-app) - is a new officially supported way to
  create single-page React applications. It offers a modern build setup with no configuration.
* [Bulma](https://bulma.io) - Bulma is a modern CSS framework based on Flexbox
* [Apollo 2](http://dev.apollodata.com) - A flexible, fully-featured GraphQL client for every platform.
* [React Final Form](https://github.com/erikras/react-final-form) - High performance subscription-based form state
  management for React.

### Backend

* Elixir 1.5
* Phoenix 1.3
* Erlang 20.0
* [Absinthe](https://github.com/absinthe-graphql/absinthe) - The [GraphQL](http://graphql.org) toolkit for Elixir.
* [Graphiql](https://github.com/graphql/graphiql) - Graphiql is an in-browser IDE for exploring GraphQL.
* [Arc](https://github.com/stavro/arc) - Flexible file upload and attachment library for Elixir.
* [ExAws](https://github.com/CargoSense/ex_aws) - A flexible, easy to use set of clients AWS APIs for Elixir. Use to
  store attachments in Amazon S3.
* PostgreSQL for database.

## Features

* CRUD (create / read / update / delete) on recipes
* Creating comments on recipe page
* Pagination on recipes listing
* Searching on recipes
* Authentication with token
* Creating user account
* Update user profile and changing password
* Application ready for production

## GraphQL Using

* Queries et mutations
* FetchMore for pagination
* Using `apollo-cache-inmemory`
* Apollo Link (dedup, onError, auth)
* [Managing local state](https://github.com/apollographql/apollo-link-state) with Apollo Link
* Optimistic UI
* [Static GraphQL queries](https://dev-blog.apollodata.com/5-benefits-of-static-graphql-queries-b7fa90b0b69a)
* Validation management and integration with Final Form
* Authentication and authorizations
* Protect queries and mutations on GraphQL API
* Batching of SQL queries backend side

## Prerequisites

* Erlang 20 ([Installing Erlang](https://github.com/asdf-vm/asdf)
* Elixir 1.5 ([Installing Elixir](https://elixir-lang.org/install.html))
* Phoenix 1.3 ([Installing Phoenix](https://hexdocs.pm/phoenix/installation.html))
* Node 9.2 ([Installing Node](https://nodejs.org/en/download/package-manager))
* PostgreSQL

## Getting Started

* Checkout the yummy git tree from Github

          $ git clone https://github.com/MatthieuSegret/yummy-phoenix-graphql.git
          $ cd yummy-phoenix-graphql
          yummy-phoenix-graphql$

* Install dependencies :

          yummy-phoenix-graphql$ mix deps.get

* Create and migrate your database :

          yummy-phoenix-graphql$ mix ecto.create && mix ecto.migrate

* Load sample records:

          yummy-phoenix-graphql$ mix run priv/repo/seeds.exs

* Start Phoenix endpoint

          yummy-phoenix-graphql$ mix phx.server

* Run Yarn to install javascript package in other terminal:

          yummy-phoenix-graphql$ cd client
          yummy-phoenix-graphql/client$ yarn

* Start client in development mode. You should be able to go to `http://localhost:3000` :

            yummy-phoenix-graphql/client$ yarn start

## Next step

* [ ] Batch of GraphQL queries into one HTTP request
* [ ] Use Flow Type
* [ ] Use subscription GraphQL feature
* [ ] Create mobile app with React Native

## Screens

#### Listing recipes

<img alt="Listing recipes" src="http://documents.matthieusegret.com/listing-recipes.png" width="500">

#### Editing recipe

<img alt="Editing recipe" src="http://documents.matthieusegret.com/editing-recipe.png" width="500">

#### Recipe page

<img alt="Recipe page" src="http://documents.matthieusegret.com/recipe-page.png" width="500">

## License

MIT © [Matthieu Segret](http://matthieusegret.com)
