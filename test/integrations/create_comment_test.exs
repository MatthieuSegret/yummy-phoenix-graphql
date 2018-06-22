defmodule YummyWeb.Integrations.CreateCommentTest do
  use YummyWeb.IntegrationCase, async: false

  setup do
    user = insert(:user)
    {:ok, %{user: user}}
  end

  test "create comment on recipe page", %{session: session, user: user} do
    recipe = insert(:recipe)

    session
    |> user_sign_in(user: user)
    |> visit("/recipes/#{recipe.id}")
    |> fill_in(text_field("Nouveau commentaire"), with: "A new comment")
    |> click(button("Commenter"))
    |> assert_has(css(".comment .comment-content", text: "A new comment"))
    |> assert_has(css(".comment .comment-author em", text: user.name))
  end
end
