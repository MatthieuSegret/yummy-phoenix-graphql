defmodule YummyWeb.Integrations.ShowRecipesTest do
  use YummyWeb.IntegrationCase, async: true

  @search_input css("form[role='search'] .input[name='keywords']")

  setup do
    user = insert(:user) |> with_recipes() |> Repo.preload(:recipes)

    {:ok, %{user: user}}
  end

  test "list recipes", %{session: session, user: user} do
    titles = session
    |> visit("/")
    |> find(css(".recipes .recipe", count: 5))
    |> Enum.map(& find(&1, css(".title > a")) |> Element.text())

    expected_titles = user.recipes
    |> Enum.take(5)
    |> Enum.map(& &1.title)

    assert titles == expected_titles
  end

  test "show next recipes", %{session: session, user: user} do
    titles = session
    |> visit("/")
    |> click(button("Plus de recettes"))
    |> find(css(".recipes .recipe", count: 10))
    |> Enum.map(& find(&1, css(".title > a")) |> Element.text())

    expected_titles = user.recipes
    |> Enum.take(10)
    |> Enum.map(& &1.title)

    assert titles == expected_titles
  end

  test "Search on recipes", %{session: session} do
    insert(:recipe, title: "a first awesome cake")
    insert(:recipe, content: "a second awesome cake")

    session
    |> visit("/")
    |> fill_in(@search_input, with: "awesome cake")
    |> click(button("Rechercher"))
    |> assert_eq(@search_input, value: "awesome cake")
    |> assert_has(css(".recipes .recipe", count: 2, text: "awesome cake"))
    |> assert_has(css(".title > a", text: "a first awesome cake"))
    |> assert_has(css(".recipe-begin", text: "a second awesome cake"))
  end

  test "Show a recipe", %{session: session, user: user} do
    recipe = user.recipes |> List.first() |> Repo.preload(:author)

    session
    |> visit("/")
    |> click(link(recipe.title))
    |> assert_eq(css(".recipe-show .title-wrapper h1.title"), text: recipe.title)
    |> assert_eq(css(".recipe-show .recipe-total-time"), text: recipe.total_time)
    |> assert_eq(css(".recipe-show .recipe-level"), text: recipe.level)
    |> assert_eq(css(".recipe-show .recipe-budget"), text: recipe.budget)
    |> assert_eq(css(".recipe-show .recipe-author"), text: "Par " <> recipe.author.name)
    |> assert_eq(css(".recipe-show .recipe-content p"), text: recipe.content)
  end
end