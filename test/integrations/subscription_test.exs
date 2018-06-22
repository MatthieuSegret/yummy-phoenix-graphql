defmodule YummyWeb.Integrations.SubscriptionTest do
  # Turn async to false to avoid disruption between tests because of subscription to new recipe
  use YummyWeb.IntegrationCase, async: false

  setup do
    user = insert(:user)
    metadata = Phoenix.Ecto.SQL.Sandbox.metadata_for(Yummy.Repo, self())

    {:ok, %{user: user, metadata: metadata}}
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
