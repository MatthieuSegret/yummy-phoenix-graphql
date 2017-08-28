# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Yummy.Repo.insert!(%Yummy.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.


alias Yummy.Repo
alias Yummy.Recipes
alias Yummy.Recipes.Recipe

Recipe |> Repo.delete_all
Recipes.create_recipe(%{
  title: "Panna cotta coco fruits rouges",
  content: ~s[#### Ingrédients
  
  - 400 g de lait de coco
  - 100 g de crème fraîche épaisse
  - 50 g de sucre
  - 4 feuilles de gélatine
  - 450 g de fruit rouge
  - 1 sachet de sucre vanillé
  - 1 jus de citron
  
  #### Etape 1
  Mettre à tremper les feuilles de gélatine dans de l'eau froide 5 à 10 minutes.
  
  #### Etape 2
  Pendant ce temps, faire chauffer le lait de coco et la crème épaisse dans une casserole, ajouter le sucre.
  
  #### Etape 3
  Quand le mélange est bien chaud, hors du feu, mettre la gélatine et bien fouetter.
  
  #### Etape 4
  Répartir le mélange dans des verres et laisser refroidir avant de mettre au frigo (1 nuit c'est parfait mais 3h suffisent).
  
  #### Etape 5
  Réserver quelques fruits pour la décoration. Préparer le coulis de fruits rouges en ajoutant le sucre vanillé et le jus de citron. Mixer. Réserver au frigo.
  
  #### Etape 6
  Un peu avant de servir, répartir le coulis et décorer avec les fruits réservés.]
})


Recipes.create_recipe(%{
  title: "Tarte aux figues",
  content: ~s[#### Ingrédients
  
  - 20 figues fraîches
  - 1 pâte brisée
  - 150 g de sucre semoul
  - 100 g de sucre glace
  - 1 citron
  - 4 cuillères à soupe de confiture (abricot, ou à défaut groseille ou rhubarbe)
  
  #### Etape 1
  Foncer un grand moule à tarte beurré et fariné de pâte brisée, piquer la pâte à la fourchette, y mettre cailloux ou noyaux, passer au four 210 °C 20 mn.
  
  #### Etape 2
  Garniture : presser le citron, laver les figues, les sécher, couper en deux dans le sens de la hauteur. Les mettre dans un plat creux, saupoudrer de sucre semoule, arroser de citron.
  
  #### Etape 3
  Macérer 1/2 h en retournant de temps en temps.
  
  #### Etape 4
  Laisser tiédir la pâte précuite 10 mn. Etendre la confiture d'abricots, poser dessus les figues, face coupée dessous. Saupoudrer de sucre glace, passer au four 230 °C 7 à 8 mn pour caraméliser légèrement le dessus des figues.]
})


Recipes.create_recipe(%{
  title: "Clafoutis aux tomates cerise",
  content: ~s[#### Ingrédients
  
  - 1.5 cuillères à soupe de Moutarde Fine et Forte Amora
  - 1.5 cuillères à soupe de maïs
  - 3 cuillères à café d'arôme Knorr
  - 375 g de tomate cerise
  - 225 g de dés de jambon
  - 75 g d'emmental râpé
  - 30 cl de crème liquide
  - 6 oeufs
  - 7.5 cl de lait
  - 1 Huile d'olive
  - 1 cuillère à café de thym
  - Sel
  - Poivre
  
  #### Etape 1
  Préchauffer le four à 160°C (thermostat 5).
  
  #### Etape 2
  Laver les tomates cerises et les couper en deux. Les mettre dans un plat à gratin et les arroser d'un filet d'huile d'olive. Assaisonner et saupoudrer de thym et de 2 cuillères de Secret d'arômes Knorr puis enfourner à mi-hauteur pour 10 minutes de cuisson.
  
  #### Etape 3
  Pendant ce temps, fouetter les oeufs dans un saladier avec la moutarde.
  
  #### Etape 4
  Dans un bol, diluer la Maïzena dans le lait et la crème liquide et incorporer ce mélange aux oeufs battus. Assaisonner et ajouter l'emmental râpé et les dés de jambon puis mélanger avec une fourchette.
  
  #### Etape 5
  Quand les tomates ont rôti, sortir le plat à gratin du four et recouvrir les tomates cerises de pâte à clafoutis. Saupoudrer d'une cuillère de Secret d'arômes et enfourner pour 25 à 30 minutes de cuisson.
  
  #### Etape 6
  Quand le clafoutis est cuit, sortir le plat du four et laisser tiédir quelques minutes avant de déguster.]
})


Recipes.create_recipe(%{
  title: "Tresse feuilletée au chocolat",
  content: ~s[#### Ingrédients
  
  - 1 pâte feuilletée (rectangle de préférence)
  - 1 tablette de chocolat
  - 1 oeuf
  
  #### Etape 1
  Préchauffer le four à 200°C (thermostat 7).
  
  #### Etape 2
  Dérouler la pâte feuilleté sur une plaque de four recouverte de papier cuisson. Disposer la tablette de chocolat au centre la pâte, le haut de la tablette doit toucher le bord supérieur de la pâte.
  
  #### Etape 3
  Couper des bandes de pâte d'environ 2 cm de large, en partant de la tablette et en allant vers le bord. Couper les bandes légèrement en diagonale. Faire ces bandes de chaque côté de la tablette.
  
  #### Etape 4
  Prendre les 2 premières bandes et les replier sur le chocolat en les croisant. couper l'excès de pâte dans la longueur. Recommencer l'opération avec toutes les bandes.
  
  #### Etape 5
  Bien enfermer la tablette de chocolat en soudant les bords des 2 extrémités.
  
  #### Etape 6
  Badigeonner de jaune d'oeuf et enfourner 20 minutes.
  
  #### Etape 7
  Il est possible de saupoudrer de pistaches, de noix, de noisettes ou d'amandes concassées avant d'enfourner.]
})


Recipes.create_recipe(%{
  title: "Pain de courgettes",
  content: ~s[#### Ingrédients
  
  - courgettes (ou 4 moyennes)
  - gousses d'ail
  - Sel
  - Poivre
  - 4 oeufs
  - 1 petit pot de crême fraîche
  - 3 biscottes émiettées (chapelure)
  
  #### Etape 1
  Peler quelques courgettes (selon grosseur), les couper en petits dés, puis les faire revenir à l'huile d'olive 20 à 25 mn avec l'ail haché, le sel, le poivre et le basilic.
  
  #### Etape 2
  D'autre part, battre energiquement 4 oeufs, puis y incorporer la crème fraîche et la chapelure. Mélanger le tout aux courgettes.
  
  #### Etape 3
  Cuire envirn 45 mn à four moyen, dans un moule à cake beurré et tapissé de rondelles de courgettes.
  
  #### Etape 4
  Servir tiède ou froid.]
})


Recipes.create_recipe(%{
  title: "Cake châtaigne et crème de marron",
  content: ~s[#### Ingrédients
  
  - 3  oeufs
  - 120 g de sucre
  - 160 g de farine
  - 1/3 sachet de levure
  - 140 g de beurre
  - 500 g de crème de marron
  - 100 g de châtaigne en petits morceaux
  
  #### Etape 1
  Bien mélanger le sucre et les œufs jusqu'à que le mélange prenne une légère couleur blanchâtre.
  
  #### Etape 2
  Ajouter la farine et la levure puis mélanger le tout.
  
  #### Etape 3
  Ajouter le beurre fondu.
  
  #### Etape 4
  Ajouter la crème de marron et les châtaignes.
  
  #### Etape 5
  Faire cuire à 180 degrés pendant 45 min.
  J'ajoute mon grain de sel.]
})