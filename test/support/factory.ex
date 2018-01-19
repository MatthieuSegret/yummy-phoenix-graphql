defmodule Yummy.Factory do
  use ExMachina.Ecto, repo: Yummy.Repo
  
  def user_factory do
    %Yummy.Accounts.User{
      name: Faker.Superhero.name,
      email: sequence(:email, &"#{&1}#{Faker.Internet.email}"),
      password: "12341234",
      password_hash: Comeonin.Bcrypt.hashpwsalt("12341234"),
    }
  end

  def with_recipes(%Yummy.Accounts.User{} = user) do
    insert_list(10, :recipe, author: user)
    user
  end
  
  def recipe_factory do
    %Yummy.Recipes.Recipe{
      title: Faker.Lorem.sentence(%Range{first: 1, last: 6}),
      content: Faker.Lorem.paragraph(%Range{first: 1, last: 20}),
      total_time: "30 min",
      level: "Facile",
      budget: "Bon marché",
      uuid: Ecto.UUID.generate(),
      author: build(:user)
    }
  end
end