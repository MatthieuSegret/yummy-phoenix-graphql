defmodule YummyWeb.Integrations.SubscriptionTest do
  use YummyWeb.IntegrationCase, async: true

  setup do
    user = insert(:user)
    metadata = Phoenix.Ecto.SQL.Sandbox.metadata_for(Yummy.Repo, self())

    {:ok, %{user: user, metadata: metadata}}
  end

  test "Display recipes in real-time", %{user: user, metadata: metadata} do

    {:ok, navigation1} = Wallaby.start_session(metadata: metadata)
    navigation1
    |> visit("/")

    {:ok, navigation2} = Wallaby.start_session(metadata: metadata)
    navigation2
    |> user_sign_in(user: user)
    |> visit("/recipes/new")
    |> fill_in(text_field("Titre"), with: "Un super gâteau")
    |> fill_in(text_field("Recette"), with: "Une recette facile")
    |> click(button("Soumettre"))
    |> find(css(".recipes .recipe", count: 1))
    |> assert_has(css(".recipe:first-child .title > a", text: "Un super gâteau"))
    |> assert_has(css(".recipe:first-child .recipe-begin", text: "Une recette facile"))

    navigation1
    |> find(css(".recipes .recipe", count: 1))
    |> assert_has(css(".recipe:first-child .title > a", text: "Un super gâteau"))
    |> assert_has(css(".recipe:first-child .recipe-begin", text: "Une recette facile"))
  end

  test "Display comments in real-time", %{user: user, metadata: metadata} do
    recipe = insert(:recipe, author: user)

    {:ok, navigation1} = Wallaby.start_session(metadata: metadata)
    navigation1
    |> visit("/recipes/#{recipe.id}")

    {:ok, navigation2} = Wallaby.start_session(metadata: metadata)
    navigation2
    |> user_sign_in(user: user)
    |> visit("/recipes/#{recipe.id}")
    |> fill_in(text_field("Nouveau commentaire"), with: "A new comment")
    |> click(button("Commenter"))
    |> find(css(".comment", count: 1))
    |> assert_has(css(".comment .comment-content", text: "A new comment"))
    |> assert_has(css(".comment .comment-author em", text: user.name))

    navigation1
    |> find(css(".comment", count: 1))
    |> assert_has(css(".comment .comment-content", text: "A new comment"))
    |> assert_has(css(".comment .comment-author em", text: user.name))
  end
end