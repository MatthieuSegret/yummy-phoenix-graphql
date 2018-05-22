defmodule YummyWeb.Integrations.CreateRecipeTest do
  # Turn async to false to avoid disruption between tests because of subscription to new recipe
  use YummyWeb.IntegrationCase, async: false

  setup do
    user = insert(:user)
    {:ok, %{user: user}}
  end

  describe "when user create a recipe" do
    test "with successful", %{session: session, user: user} do
      path =
        session
        |> user_sign_in(user: user)
        |> visit("/recipes/new")
        |> fill_in(text_field("Titre"), with: "Un super gâteau")
        |> fill_in(select("Temps"), with: "10 min")
        |> fill_in(select("Niveau"), with: "Très facile")
        |> fill_in(select("Budget"), with: "Moyen")
        |> fill_in(text_field("Recette"), with: "Une recette facile")
        |> attach_file(css("#image"), path: "priv/repo/images/panna-cotta.jpg")
        |> click(button("Soumettre"))
        |> assert_eq(notice_msg(), text: "La recette a bien été créée.")
        |> assert_has(css(".recipe:first-child .title > a", text: "Un super gâteau"))
        |> assert_has(css(".recipe:first-child .recipe-total-time", text: "10 min"))
        |> assert_has(css(".recipe:first-child .recipe-level", text: "Très facile"))
        |> assert_has(css(".recipe:first-child .recipe-budget", text: "Moyen"))
        |> assert_has(css(".recipe:first-child .recipe-begin", text: "Une recette facile"))
        |> assert_has(css(".recipe:first-child .recipe-image"))
        |> current_path()

      assert path == "/"

      recipe = Yummy.Recipes.Recipe |> last(:inserted_at) |> Repo.one()
      assert recipe.title == "Un super gâteau"
      assert recipe.total_time == "10 min"
      assert recipe.level == "Très facile"
      assert recipe.budget == "Moyen"
      assert recipe.content == "Une recette facile"
      assert recipe.image_url != nil
    end

    test "with invalid input", %{session: session, user: user} do
      path =
        session
        |> user_sign_in(user: user)
        |> visit("/recipes/new")
        |> fill_in(text_field("Titre"), with: "Un super gâteau")
        |> fill_in(text_field("Recette"), with: "123")
        |> click(button("Soumettre"))
        |> assert_eq(error_msg(), text: "Des erreurs ont eu lieu, veuillez vérifier :")
        |> assert_eq(css(".label[for='content'] ~ p.help.is-danger"), text: "est trop court (au moins 10 caractères)")
        |> current_path()

      assert path == "/recipes/new"
    end
  end
end
