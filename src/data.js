export const nutritionTargets = { calories: 1750, protein: 125, proteinUpper: 130, fiber: 25, fiberUpper: 30, saturatedFatMax: 15, trackingMetrics: ["calories","protein","carbs","fat","fiber","saturatedFat","sugar","sodium"], primaryMetrics: ["calories","protein","fiber","saturatedFat"] };
export const nutritionSource = { primary: "USDA FoodData Central", tracking: "MyFitnessPal", policy: "USDA-calculated values become planning values only after ingredient quantities and servings are quantified. MyFitnessPal is a reconciliation check, not the calculation source." };

const nutritionPending = { calories:"To be calculated", protein:"To be calculated", carbs:"To be calculated", fat:"To be calculated", fiber:"To be calculated", saturatedFat:"To be calculated", sugar:"To be calculated", sodium:"To be calculated", status:"pending", source:"USDA FoodData Central", mfpStatus:"not checked" };

export const nutritionComponents = {
  "basmati-rice": {
    id: "basmati-rice", name: "Basmati rice", category: "Grain",
    shoppingBasis: "dry grams", servingBasis: "cooked grams",
    portionStrategy: { mode: "nutrition-target", fixedCupServing: false },
    quantification: { status: "needs-usda-match-and-cooked-yield", note: "Prep converts total cooked grams required by household portions into dry grams for cooking and shopping." }
  }
};

export const recipes = [
  {
    id: "jammy-eggs-sourdough-avocado", name: "Jammy eggs + sourdough + avocado",
    description: "A substantial savory breakfast with jammy eggs, sourdough, and avocado.",
    servings: 1, servingSize: "1 breakfast", prepTime: "5 minutes", cookTime: "8 minutes",
    tags: ["Breakfast", "Protein", "Savory"],
    ingredients: [
      { key: "egg", item: "large eggs", amount: 2, unit: "", grams: 100, category: "Protein", nutritionLookup: { source: "USDA FoodData Central", query: "Egg, whole, raw, fresh", fdcId: 171287, dataType: "SR Legacy", status: "matched" } },
      { key: "sourdough", item: "sourdough bread", amount: 1, unit: "small slice", grams: 31, category: "Bakery", nutritionLookup: { source: "USDA FoodData Central", query: "Bread, sour dough", fdcId: 2707646, dataType: "FNDDS 2021-2023", status: "matched" } },
      { key: "avocado", item: "avocado", amount: 0.5, unit: "medium", grams: 75, category: "Produce", nutritionLookup: { source: "USDA FoodData Central", query: "Avocados, raw, all commercial varieties", fdcId: 171705, dataType: "SR Legacy", status: "matched" } }
    ],
    instructions: ["Cook the eggs until the whites are set and the yolks remain jammy.", "Toast the sourdough.", "Serve with measured avocado; season to taste."],
    portions: { alisa: "2 large eggs + 1 small slice sourdough toast + ½ medium avocado", mom: "Adjust separately when planned" },
    storage: "Best prepared fresh.",
    nutrition: { calories: 347, protein: 17.4, carbs: 23.2, fat: 21.3, fiber: 5.7, saturatedFat: 4.9, sugar: 2.3, sodium: 334, status: "calculated", source: "USDA FoodData Central", mfpStatus: "not checked" },
    quantification: { status: "usda-calculated", displaySystem: "US customary kitchen measures", calculationBasis: "USDA gram-equivalent weights stored behind the scenes", requiredNutrients: ["calories","protein","carbs","fat","fiber","saturatedFat","sugar","sodium"], note: "Recipes display familiar kitchen portions first. Nutrition is calculated from matched USDA records and internal gram-equivalent portion weights. MyFitnessPal reconciliation remains pending." }
  },
  {
    id: "greek-chicken-feta-meatballs", name: "Greek chicken-feta meatballs",
    description: "Tender, herb-filled chicken meatballs with feta and lemon—built for Sunday dinner and flexible leftovers.",
    servings: 4, servingSize: "Target-generated portion", prepTime: "20 minutes", cookTime: "20 minutes",
    tags: ["Greek-inspired", "Protein", "Meal prep"],
    ingredients: [
      { key: "ground-chicken", item: "ground chicken", amount: 1.25, unit: "lb", grams: 567, category: "Protein", nutritionRole: "variable-protein", nutritionOptions: [{ label: "USDA generic ground chicken", source: "USDA FoodData Central", lookupQuery: "Chicken, ground, with additives, raw", dataType: "Foundation", status: "verified-generic" }], brandedOptionsPolicy: "A stated lean/fat ratio such as 93/7 or 98/2 may be added only when it is backed by a specific verified branded FoodData Central record or package Nutrition Facts record.", selectionRule: "Choose among verified nutrient records using the full-day nutrition target; never infer a lean/fat ratio from the generic USDA ground-chicken record." },
      { key: "feta", item: "feta cheese", amount: 4, unit: "oz", category: "Dairy" },
      { key: "egg", item: "egg", amount: 1, unit: "", category: "Dairy" },
      { key: "panko", item: "panko breadcrumbs", amount: 0.5, unit: "cup", category: "Pantry" },
      { key: "parsley", item: "flat-leaf parsley", amount: 0.5, unit: "bunch", category: "Herbs" },
      { key: "lemon", item: "lemon", amount: 1, unit: "", category: "Produce" },
      { key: "oregano", item: "dried oregano", amount: 1, unit: "tsp", category: "Pantry", pantry: true },
      { key: "olive-oil", item: "olive oil", amount: 1, unit: "tbsp", category: "Pantry", pantry: true },
    ],
    instructions: ["Heat the oven to 425°F and line a sheet pan.", "Gently mix all ingredients except the olive oil; shape into evenly sized meatballs.", "Brush with olive oil and bake until browned and cooked through, about 16–20 minutes.", "Rest for 5 minutes and finish with lemon."],
    portions: { alisa: "Generated from Alisa's active nutrition target", mom: "Generated separately from Mom's nutrition target" },
    portionStrategy: { mode: "nutrition-target", fixedMeatballCount: false, wastePriority: "After nutrition targets are satisfied, size the batch and portions to minimize planned leftovers." },
    storage: "Refrigerate in a sealed container for up to 4 days. Reheat gently or serve at room temperature.", nutrition: nutritionPending,
  },
  {
    id: "cucumber-carrot-herb-salad", name: "Cucumber, carrot & herb salad", description: "A crisp lemony side that carries fresh herbs across the week.", servings: 4, servingSize: "about 1 cup", prepTime: "15 minutes", cookTime: "0 minutes", tags: ["Mediterranean", "Fresh", "Vegetarian"],
    ingredients: [
      { key: "cucumber", item: "Persian cucumbers", amount: 4, unit: "", category: "Produce", quantification: { status: "needs-standard-edible-grams", reason: "Produce count varies by size; retain count for shopping and use edible grams for nutrition." } }, { key: "carrots", item: "carrots", amount: 3, unit: "", category: "Produce", quantification: { status: "needs-standard-edible-grams" } },
      { key: "parsley", item: "flat-leaf parsley", amount: 0.5, unit: "bunch", category: "Herbs", quantification: { status: "needs-standard-edible-grams" } }, { key: "dill", item: "fresh dill", amount: 0.5, unit: "bunch", category: "Herbs", quantification: { status: "needs-standard-edible-grams" } },
      { key: "lemon", item: "lemon", amount: 1, unit: "", category: "Produce", quantification: { status: "needs-juice-grams" } }, { key: "olive-oil", item: "olive oil", amount: 2, unit: "tbsp", grams: 27, category: "Pantry", pantry: true },
    ], instructions: ["Slice the cucumbers and shave the carrots into ribbons.", "Toss with chopped herbs, lemon juice, olive oil, salt, and pepper just before serving."],
    portions: { alisa: "Generated from Alisa's active nutrition target", mom: "Generated separately from Mom's nutrition target" }, portionStrategy: { mode: "nutrition-target", fixedCupServing: false }, storage: "Keep vegetables and dressing separate for up to 3 days.", nutrition: nutritionPending,
  },
  {
    id: "mediterranean-lemon-dill-sauce", name: "Mediterranean lemon-dill Dijon sauce", description: "A cool, bright yogurt sauce with dill and Dijon for meatballs, salads, and Friday’s use-it-up bowl.", servings: 1, servingSize: "Target-generated portion from measured batch", prepTime: "10 minutes", cookTime: "0 minutes", tags: ["Mediterranean", "Sauce", "Vegetarian"],
    ingredients: [
      { key: "greek-yogurt", item: "plain Greek yogurt", amount: 0.5, unit: "cup", category: "Dairy", nutritionRole: "variable-fat-dairy", nutritionOptions: [{ label: "nonfat", fatPercent: 0, lookupQuery: "Greek yogurt plain nonfat" }, { label: "2%", fatPercent: 2, lookupQuery: "Greek yogurt plain lowfat 2%" }, { label: "whole milk", fatPercent: 5, lookupQuery: "Greek yogurt plain whole milk" }], selectionRule: "Choose yogurt fat percentage from the full-day nutrition target rather than using a fixed default." },
      { key: "olive-oil", item: "extra-virgin olive oil", amount: 1, unit: "tbsp", grams: 13.5, category: "Pantry", pantry: true, nutritionLookup: { source: "USDA FoodData Central", query: "olive oil", fdcId: 748608, dataType: "Foundation", status: "matched" } },
      { key: "lemon-juice", item: "fresh lemon juice", amount: 2, unit: "tbsp", grams: 30, category: "Produce", nutritionLookup: { source: "USDA FoodData Central", query: "lemon juice raw", fdcId: 167747, dataType: "SR Legacy", status: "matched" } },
      { key: "dill", item: "fresh dill, finely chopped", amount: 2, unit: "tbsp", category: "Herbs", quantification: { status: "needs-standard-grams" } },
      { key: "dijon", item: "Dijon mustard", amount: 1, unit: "tsp", category: "Pantry", pantry: true, quantification: { status: "needs-standard-grams" } },
      { key: "garlic-oil", item: "garlic-infused olive oil", amount: 1, unit: "tsp", grams: 4.5, category: "Pantry", pantry: true },
      { key: "black-pepper", item: "black pepper", amount: 1, unit: "to taste", category: "Pantry", pantry: true },
      { key: "salt", item: "salt", amount: 1, unit: "small pinch", category: "Pantry", pantry: true }
    ],
    instructions: ["Stir the yogurt, olive oil, lemon juice, finely chopped dill, Dijon, and garlic-infused oil together.", "Season with black pepper and a small pinch of salt; chill for 15 minutes before serving."], portions: { alisa: "Generated from Alisa's active nutrition target", mom: "Generated separately from Mom's nutrition target" }, portionStrategy: { mode: "nutrition-target", fixedTablespoonServing: false, batchMeasurement: "Store final batch weight in grams before assigning portions." }, storage: "Refrigerate for up to 4 days; stir before serving.", nutrition: nutritionPending,
  },
  {
    id: "vietnamese-chicken-cabbage-salad", name: "Vietnamese chicken cabbage salad", description: "Crunchy cabbage, tender chicken, herbs, and a lively lime-fish sauce dressing.", servings: 4, servingSize: "about 2 cups", prepTime: "25 minutes", cookTime: "15 minutes", tags: ["Vietnamese-inspired", "Salad", "High protein"],
    ingredients: [ { key: "chicken-breast", item: "boneless chicken breast", amount: 1.25, unit: "lb", category: "Protein" }, { key: "cabbage", item: "green cabbage", amount: 0.5, unit: "head", category: "Produce" }, { key: "carrots", item: "carrots", amount: 2, unit: "", category: "Produce" }, { key: "mint", item: "fresh mint", amount: 1, unit: "bunch", category: "Herbs" }, { key: "cilantro", item: "fresh cilantro", amount: 1, unit: "bunch", category: "Herbs" }, { key: "lime", item: "limes", amount: 2, unit: "", category: "Produce" }, { key: "fish-sauce", item: "fish sauce", amount: 2, unit: "tbsp", category: "Pantry", pantry: true }, { key: "brown-sugar", item: "brown sugar or honey", amount: 1, unit: "tbsp", category: "Pantry", pantry: true } ],
    instructions: ["Poach or pan-cook the chicken until cooked through, then rest and shred.", "Whisk lime juice, fish sauce, brown sugar, and a splash of water.", "Toss chicken with finely sliced cabbage, carrot, herbs, and dressing just before serving."], portions: { alisa: "2 cups with about 5 oz chicken", mom: "1½ cups with about 4 oz chicken" }, storage: "Refrigerate components separately for up to 3 days; dress only what you will eat.", nutrition: nutritionPending,
  },
  {
    id: "sushi-style-rice-bowl", name: "Sushi-style rice bowl", description: "A customizable bowl with sushi rice, crisp vegetables, avocado, and either ahi or cooked salmon.", servings: 2, servingSize: "1 composed bowl", prepTime: "20 minutes", cookTime: "20 minutes", tags: ["Japanese-inspired", "Bowl", "Fresh"],
    ingredients: [ { key: "ahi", item: "sushi-grade ahi tuna", amount: 6, unit: "oz", category: "Protein", pickup: "wednesday" }, { key: "salmon", item: "salmon", amount: 6, unit: "oz", category: "Protein", pickup: "wednesday" }, { key: "sushi-rice", item: "sushi rice", amount: 1, unit: "cup", category: "Pantry", pantry: true }, { key: "cucumber", item: "Persian cucumbers", amount: 2, unit: "", category: "Produce", pickup: "wednesday" }, { key: "avocado", item: "ripe avocado", amount: 1, unit: "", category: "Produce", pickup: "wednesday" }, { key: "sprouts", item: "radish sprouts", amount: 1, unit: "pack", category: "Produce", pickup: "wednesday" }, { key: "rice-vinegar", item: "rice vinegar", amount: 2, unit: "tbsp", category: "Pantry", pantry: true }, { key: "sesame-seeds", item: "sesame seeds", amount: 1, unit: "tbsp", category: "Pantry", pantry: true } ],
    instructions: ["Cook and season the sushi rice with rice vinegar; cool until warm.", "Cook Mom’s salmon through. Keep Alisa’s ahi well chilled and slice with a clean knife just before serving.", "Arrange rice, fish, cucumber, avocado, and sprouts in each bowl; finish with sesame seeds and sauce."], portions: { alisa: "3 oz raw ahi, ¾ cup rice, and half the vegetables", mom: "3 oz cooked salmon, ½ cup rice, and half the vegetables" }, storage: "Serve fish the day it is purchased. Refrigerate cooked rice promptly and use within 1 day.", nutrition: nutritionPending,
  },
  {
    id: "japanese-ginger-sesame-sauce", name: "Japanese ginger-sesame sauce", description: "A savory, gingery drizzle for rice bowls and vegetables.", servings: 6, servingSize: "2 tablespoons", prepTime: "10 minutes", cookTime: "0 minutes", tags: ["Japanese-inspired", "Sauce", "Dairy-free"],
    ingredients: [ { key: "ginger", item: "fresh ginger", amount: 2, unit: "inch", category: "Produce", pickup: "wednesday" }, { key: "tamari", item: "low-sodium soy sauce or tamari", amount: 0.25, unit: "cup", category: "Pantry", pantry: true }, { key: "rice-vinegar", item: "rice vinegar", amount: 2, unit: "tbsp", category: "Pantry", pantry: true }, { key: "sesame-oil", item: "toasted sesame oil", amount: 1, unit: "tbsp", category: "Pantry", pantry: true }, { key: "brown-sugar", item: "brown sugar or honey", amount: 1, unit: "tsp", category: "Pantry", pantry: true } ],
    instructions: ["Finely grate the ginger.", "Whisk all ingredients until the sweetener dissolves; adjust with a spoonful of water if desired."], portions: { alisa: "2 tablespoons", mom: "1–2 tablespoons" }, storage: "Refrigerate for up to 1 week and shake well before using.", nutrition: nutritionPending,
  },
  {
    id: "use-it-up-bowl", name: "Friday use-it-up bowl", description: "A flexible formula, not a strict recipe: turn the week’s good leftovers into a fresh, composed dinner.", servings: 2, servingSize: "1 bowl", prepTime: "15 minutes", cookTime: "5 minutes", tags: ["Flexible", "Leftovers", "No-waste"],
    ingredients: [ { key: "leftover-protein", item: "remaining cooked protein", amount: 2, unit: "portions", category: "Other", optional: true }, { key: "leftover-rice", item: "remaining cooked rice", amount: 1.5, unit: "cups", category: "Other", optional: true }, { key: "cucumber", item: "remaining cucumber", amount: 1, unit: "", category: "Produce", optional: true }, { key: "carrots", item: "remaining carrots", amount: 1, unit: "", category: "Produce", optional: true }, { key: "cabbage", item: "remaining cabbage", amount: 0.25, unit: "head", category: "Produce", optional: true }, { key: "avocado", item: "remaining avocado", amount: 1, unit: "", category: "Produce", optional: true }, { key: "leftover-sauce", item: "existing sauce", amount: 4, unit: "tbsp", category: "Other", optional: true } ],
    instructions: ["Check the refrigerator and choose only leftovers that are still fresh.", "Reheat protein and rice safely, or serve cold when appropriate.", "Layer with crisp vegetables and herbs, then finish with an existing sauce."], portions: { alisa: "Build to appetite, prioritizing protein and vegetables", mom: "A smaller bowl with extra vegetables" }, storage: "This meal is intended to use leftovers; follow the storage guidance of each original component.", nutrition: nutritionPending,
  },
  {
    id: "brown-sugar-mayo-salmon", name: "Brown-sugar mayo glazed salmon", description: "An easy savory-sweet salmon with a burnished glaze for Saturday dinner.", servings: 4, servingSize: "1 salmon fillet", prepTime: "10 minutes", cookTime: "15 minutes", tags: ["Seafood", "Easy", "Family dinner"],
    ingredients: [ { key: "salmon", item: "salmon", amount: 1.5, unit: "lb", category: "Protein", pickup: "wednesday" }, { key: "mayonnaise", item: "mayonnaise", amount: 0.25, unit: "cup", category: "Pantry" }, { key: "brown-sugar", item: "brown sugar or honey", amount: 1, unit: "tbsp", category: "Pantry", pantry: true }, { key: "tamari", item: "low-sodium soy sauce or tamari", amount: 1, unit: "tbsp", category: "Pantry", pantry: true } ],
    instructions: ["Heat the oven to 425°F and place salmon on a lined sheet pan.", "Mix mayonnaise, brown sugar, and tamari; spread a thin layer over the fish.", "Roast until the center flakes and is cooked to your preferred doneness, about 10–15 minutes."], portions: { alisa: "5–6 oz salmon with ¾ cup rice", mom: "4 oz salmon with ½ cup rice" }, storage: "Refrigerate cooked salmon for up to 3 days.", nutrition: nutritionPending,
  },
  {
    id: "sesame-cucumber-carrot-salad", name: "Sesame cucumber & ribbon-carrot salad", description: "A crunchy, tangy salad to balance the glazed salmon.", servings: 4, servingSize: "about 1 cup", prepTime: "15 minutes", cookTime: "0 minutes", tags: ["Japanese-inspired", "Fresh", "Vegetarian"],
    ingredients: [ { key: "cucumber", item: "Persian cucumbers", amount: 4, unit: "", category: "Produce", pickup: "wednesday" }, { key: "carrots", item: "carrots", amount: 3, unit: "", category: "Produce" }, { key: "rice-vinegar", item: "rice vinegar", amount: 2, unit: "tbsp", category: "Pantry", pantry: true }, { key: "sesame-oil", item: "toasted sesame oil", amount: 1, unit: "tsp", category: "Pantry", pantry: true }, { key: "sesame-seeds", item: "sesame seeds", amount: 1, unit: "tbsp", category: "Pantry", pantry: true } ],
    instructions: ["Slice cucumbers and shave carrots into ribbons.", "Toss with rice vinegar and sesame oil; finish with sesame seeds just before serving."], portions: { alisa: "1 cup", mom: "1 cup" }, storage: "Best the day it is made; refrigerate undressed vegetables for up to 2 days.", nutrition: nutritionPending,
  },
  {
    id: "mediterranean-chicken-feta-chopped-salad", name: "Mediterranean chicken-feta chopped salad + sourdough", description: "A crisp Mediterranean lunch with chicken, feta, herbs, vegetables, lemon-Dijon dressing, and sourdough.", servings: 2, servingSize: "Target-generated portion", prepTime: "20 minutes", cookTime: "15 minutes", tags: ["Mediterranean", "Lunch", "High protein"],
    ingredients: [
      { key: "chicken-breast", item: "boneless skinless chicken breast", amount: 0.75, unit: "lb", category: "Protein", nutritionLookup: { source: "USDA FoodData Central", query: "chicken breast raw boneless skinless", fdcId: 2646170, dataType: "Foundation", status: "matched" } },
      { key: "cucumber", item: "Persian cucumbers", amount: 2, unit: "", category: "Produce", nutritionLookup: { source: "USDA FoodData Central", query: "cucumber with peel raw", fdcId: 2346406, dataType: "Foundation", status: "matched" }, quantification: { status: "needs-standard-edible-grams" } },
      { key: "carrots", item: "carrot", amount: 1, unit: "", category: "Produce", nutritionLookup: { source: "USDA FoodData Central", query: "carrots raw", fdcId: 170393, dataType: "SR Legacy", status: "matched" }, quantification: { status: "needs-standard-edible-grams" } },
      { key: "cabbage", item: "green cabbage", amount: 2, unit: "cup", category: "Produce", quantification: { status: "needs-standard-edible-grams" } },
      { key: "feta", item: "feta cheese", amount: 2, unit: "oz", category: "Dairy", nutritionLookup: { source: "USDA FoodData Central", query: "cheese feta", fdcId: 2259796, dataType: "Foundation", status: "matched" } },
      { key: "dill", item: "fresh dill", amount: 2, unit: "tbsp", category: "Herbs", nutritionLookup: { source: "USDA FoodData Central", query: "dill weed fresh", fdcId: 172233, dataType: "SR Legacy", status: "matched" }, quantification: { status: "needs-standard-grams" } },
      { key: "parsley", item: "flat-leaf parsley", amount: 2, unit: "tbsp", category: "Herbs", nutritionLookup: { source: "USDA FoodData Central", query: "parsley fresh", fdcId: 170416, dataType: "SR Legacy", status: "matched" }, quantification: { status: "needs-standard-grams" } },
      { key: "lemon-juice", item: "fresh lemon juice", amount: 2, unit: "tbsp", grams: 30, category: "Produce" },
      { key: "dijon", item: "Dijon mustard", amount: 1, unit: "tsp", category: "Pantry", pantry: true, quantification: { status: "needs-standard-grams" } },
      { key: "olive-oil", item: "extra-virgin olive oil", amount: 1, unit: "tbsp", grams: 13.5, category: "Pantry", pantry: true },
      { key: "sourdough", item: "sourdough bread", amount: 2, unit: "slice", category: "Bakery", nutritionLookup: { source: "USDA FoodData Central", query: "bread sourdough", status: "pending", note: "Candidate FDC 172675 groups French/Vienna bread with sourdough and is not specific enough to accept." }, quantification: { status: "needs-standard-grams-or-product" } }
    ],
    instructions: ["Cook the chicken until browned and cooked through, then rest and slice.", "Whisk lemon juice, Dijon, and olive oil for the dressing.", "Chop the cucumber, carrot, cabbage, dill, and parsley; toss with the dressing.", "Top with sliced chicken and feta and serve with sourdough."],
    portions: { alisa: "Generated from Alisa's active nutrition target", mom: "Generated separately from Mom's nutrition target" }, portionStrategy: { mode: "nutrition-target", fixedServing: false }, storage: "Keep chicken, chopped vegetables, dressing, and bread separate until serving.", nutrition: nutritionPending,
  },
  {
    id: "sesame-tahini-ribbon-salad", name: "Cucumber & ribbon carrots with sesame-tahini dressing",
    description: "Crisp cucumber and carrot ribbons with a creamy sesame-tahini dressing.",
    servings: 2, servingSize: "about 1½ cups", prepTime: "10 minutes", cookTime: "0 minutes", tags: ["Fresh", "Snack", "Vegetarian"],
    ingredients: [
      { key: "carrots", item: "large carrots", amount: 2, unit: "", category: "Produce" },
      { key: "english-cucumber", item: "large English cucumber", amount: 1, unit: "", category: "Produce" },
      { key: "sesame-seeds", item: "toasted sesame seeds", amount: 1, unit: "tbsp", category: "Pantry", pantry: true },
      { key: "tahini", item: "tahini", amount: 2, unit: "tbsp", category: "Pantry", pantry: true },
      { key: "rice-vinegar", item: "rice vinegar", amount: 1, unit: "tbsp", category: "Pantry", pantry: true },
      { key: "tamari", item: "soy sauce or tamari", amount: 1, unit: "tbsp", category: "Pantry", pantry: true },
      { key: "sesame-oil", item: "toasted sesame oil", amount: 1, unit: "tsp", category: "Pantry", pantry: true },
      { key: "maple-honey", item: "maple syrup or honey", amount: 1, unit: "tsp", category: "Pantry", pantry: true },
      { key: "garlic", item: "small garlic clove", amount: 1, unit: "", category: "Produce", optional: true },
      { key: "chile-flakes", item: "red pepper flakes", amount: 1, unit: "pinch", category: "Pantry", pantry: true }
    ],
    instructions: ["Peel the carrots and cucumber into long ribbons.", "Whisk tahini, rice vinegar, soy sauce or tamari, sesame oil, maple syrup or honey, and 1 tablespoon warm water. Add more water as needed to thin.", "Add grated garlic if using, then season with a pinch of salt and red pepper flakes.", "Toss the ribbons with dressing just before serving and finish with toasted sesame seeds."],
    portions: { alisa: "1 generous bowl", mom: "¾ bowl" }, storage: "Keep vegetable ribbons and dressing separate; combine just before eating.", nutrition: nutritionPending,
  },
];

export const weeks = [{
  id: "week-1", label: "Week 1", startDate: "2026-09-20", dateRange: "September 20–26", eyebrow: "A bright, flexible first week",
  sundayPrep: ["Bake chicken-feta meatballs", "Cook basmati rice", "Wash and chop sturdy vegetables", "Mix lemon-dill sauce"],
  wednesdayPickup: ["Sushi-grade ahi tuna", "Salmon", "Avocado and sprouts", "Fresh cucumbers and ginger"],
  treats: [{ key: "grapefruit-juice", item: "fresh grapefruit juice", amount: 2, unit: "servings", category: "Produce", pickup: "wednesday", shoppingOptions: "2–3 fresh grapefruit OR one small bottle 100% grapefruit juice", note: "4–6 oz per serving; planned later in the week." }],
  days: [
    { day: "Sunday", meals: { breakfast: ["jammy-eggs-sourdough-avocado"], lunch: ["mediterranean-chicken-feta-chopped-salad"], dinner: ["greek-chicken-feta-meatballs", "cucumber-carrot-herb-salad", "mediterranean-lemon-dill-sauce"], snack: ["sesame-tahini-ribbon-salad"] }, theme: "Mediterranean table", note: "Serve dinner with basmati rice." },
    { day: "Monday", meals: { breakfast: [{ label: "Greek yogurt + kiwi + basil seeds + walnuts" }], lunch: [{ label: "Leftover Greek chicken-feta meatballs + basmati rice + cucumber-carrot salad", leftover: true }], dinner: [{ label: "Open / flexible", open: true }], snack: ["sesame-tahini-ribbon-salad"] }, note: "Dinner intentionally open — dinner out or choose something easy." },
    { day: "Tuesday", meals: { breakfast: [{ label: "Goat cheese + jam + prosciutto on sourdough" }], lunch: [{ label: "Leftover Greek chicken-feta meatballs + chopped herb salad", leftover: true }], dinner: ["vietnamese-chicken-cabbage-salad"], snack: [{ label: "Greek yogurt + kiwi + basil seeds" }] }, theme: "Crisp & herb-filled" },
    { day: "Wednesday", meals: { breakfast: [{ label: "Avocado toast + poached eggs + dill" }], lunch: [{ label: "Leftover Vietnamese chicken cabbage salad", leftover: true }], dinner: [{ label: "Open / flexible", open: true }], snack: [{ label: "Kiwi + basil seeds" }] }, note: "Dinner intentionally open + quick fresh-food pickup." },
    { day: "Thursday", meals: { breakfast: [{ label: "Poached eggs + avocado toast" }, { label: "4–6 oz fresh grapefruit juice", treat: true }], lunch: [{ label: "Leftover Vietnamese chicken cabbage salad", leftover: true }], dinner: ["sushi-style-rice-bowl", "japanese-ginger-sesame-sauce"], snack: ["sesame-tahini-ribbon-salad"] }, theme: "Two-fish rice bowls" },
    { day: "Friday", meals: { breakfast: [{ label: "Goat cheese + jam + prosciutto on sourdough" }], lunch: [{ label: "Leftover ahi/salmon rice bowl components", leftover: true }], dinner: ["use-it-up-bowl"], snack: [{ label: "Green apple + lemon + Tajín" }] }, theme: "Waste-less Friday" },
    { day: "Saturday", meals: { breakfast: [{ label: "Flexible breakfast / brunch", open: true }, { label: "4–6 oz fresh grapefruit juice", treat: true }], lunch: [{ label: "Flexible lunch / brunch", open: true }], dinner: ["brown-sugar-mayo-salmon", "sesame-cucumber-carrot-salad"], snack: [{ label: "Greek yogurt + kiwi, if hungry" }] }, theme: "Easy salmon supper", note: "Serve dinner with rice." },
  ],
}];

export const activeWeekId = "week-1";
export const getActiveWeek = (today = new Date()) => {
  const dated = weeks.map((week) => ({ week, start: week.startDate ? new Date(`${week.startDate}T00:00:00`) : null })).filter((x) => x.start);
  if (!dated.length) return weeks.find((week) => week.id === activeWeekId) || weeks[weeks.length - 1];
  const eligible = dated.filter((x) => x.start <= today).sort((a, b) => b.start - a.start);
  return (eligible[0] || dated.sort((a, b) => a.start - b.start)[0]).week;
};
export const getPastWeeks = (today = new Date()) => {
  const current = getActiveWeek(today);
  return weeks.filter((week) => week.id !== current.id && week.startDate && new Date(`${week.startDate}T00:00:00`) < today).sort((a,b) => new Date(b.startDate) - new Date(a.startDate));
};
export const getRecipe = (id) => recipes.find((recipe) => recipe.id === id);

export const initialPantry = [
  ["jasmine-rice", "Jasmine rice", "Have"], ["basmati-rice", "Basmati rice", "Have"], ["sushi-rice", "Sushi rice", "Low"],
  ["olive-oil", "Olive oil", "Have"], ["garlic-oil", "Garlic-infused olive oil", "Have"], ["rice-vinegar", "Rice vinegar", "Have"],
  ["red-wine-vinegar", "Red wine vinegar", "Have"], ["tamari", "Low-sodium soy sauce / tamari", "Low"], ["fish-sauce", "Fish sauce", "Have"],
  ["sesame-oil", "Toasted sesame oil", "Have"], ["dijon", "Dijon mustard", "Have"], ["tahini", "Tahini", "Have"],
  ["sesame-seeds", "Sesame seeds", "Have"], ["tajin", "Tajín", "Have"], ["brown-sugar", "Brown sugar / honey", "Have"],
  ["oregano", "Oregano", "Have"], ["cumin", "Cumin", "Have"], ["smoked-paprika", "Smoked paprika", "Have"],
  ["zaatar", "Za’atar / sumac", "Have"], ["black-pepper", "Black pepper", "Have"], ["chile-flakes", "Chile flakes", "Have"],
].map(([key, name, status]) => ({ key, name, status }));

export const pantryStatuses = ["Have", "Low", "Buy"];

export const freshnessPolicy = {
  purpose: "Prioritize perishable food in weekly planning before it spoils without treating freshness as a pantry inventory status.",
  planningRules: [
    "Before selecting new sauces or dressings, review prepared batches marked In Fridge with a Made On date and calculate their planning use-by dates.",
    "Schedule compatible In Fridge prepared sauces in use-by order, prioritizing Use First batches before making a new sauce or dressing.",
    "If an existing prepared sauce can serve a planned meal, use that batch before scheduling Make for another compatible sauce.",
    "Use the most perishable purchased ingredients in the earliest compatible meals.",
    "Carry leftover fresh ingredients into the next compatible meal before planning a duplicate purchase.",
    "Wednesday pickup ingredients should be scheduled from Wednesday onward unless their storage life safely supports later use.",
    "Friday use-it-up meals should preferentially consume remaining fresh produce, herbs, cooked proteins, rice, and opened sauces that are still safe to eat.",
    "When generating a new week, review carryover prepared sauces and perishables before adding new ingredients to the shopping list."
  ]
};

export const preparedSauceStatuses = ["Make", "In Fridge", "Out"];
export const initialPreparedSauces = [
  { key: "med-lemon-dill", recipeId: "mediterranean-lemon-dill-sauce", name: "Mediterranean lemon-dill sauce", status: "Make", storage: "Fridge", storageDays: 4 },
  { key: "vietnamese-lime", recipeId: "vietnamese-lime-dressing", name: "Vietnamese lime dressing", status: "Make", storage: "Fridge", storageDays: 5 },
  { key: "thai-basil-lime", recipeId: "thai-basil-lime-sauce", name: "Thai basil-lime sauce", status: "Out", storage: "Fridge", storageDays: 4 },
  { key: "japanese-ginger-sesame", recipeId: "japanese-ginger-sesame-sauce", name: "Japanese ginger-sesame sauce", status: "Make", storage: "Fridge", storageDays: 7 },
  { key: "spicy-sesame", recipeId: "spicy-sesame-sauce", name: "Spicy sesame sauce", status: "Out", storage: "Fridge", storageDays: 7 }
];
