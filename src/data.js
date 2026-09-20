export const nutritionTargets = { calories: 1750, protein: 125, proteinUpper: 130, fiber: 25, fiberUpper: 30, saturatedFatMax: 15, trackingMetrics: ["calories","protein","carbs","fat","fiber","saturatedFat","sugar","sodium"], primaryMetrics: ["calories","protein","fiber","saturatedFat"] };
export const nutritionSource = { primary: "USDA FoodData Central", tracking: "MyFitnessPal", policy: "USDA-calculated values become planning values only after ingredient quantities and servings are quantified. MyFitnessPal is a reconciliation check, not the calculation source." };

const nutritionPending = { calories:"To be calculated", protein:"To be calculated", carbs:"To be calculated", fat:"To be calculated", fiber:"To be calculated", saturatedFat:"To be calculated", sugar:"To be calculated", sodium:"To be calculated", status:"pending", source:"USDA FoodData Central", mfpStatus:"not checked" };

export const recipes = [
  {
    id: "jammy-eggs-sourdough-avocado", name: "Jammy eggs + sourdough + avocado",
    description: "A substantial savory breakfast with jammy eggs, sourdough, and avocado.",
    servings: 1, servingSize: "1 breakfast", prepTime: "5 minutes", cookTime: "8 minutes",
    tags: ["Breakfast", "Protein", "Savory"],
    ingredients: [
      { key: "egg", item: "large eggs", amount: 2, unit: "", grams: 100, category: "Protein", nutritionLookup: { source: "USDA FoodData Central", query: "Egg, whole, raw, fresh", status: "pending-match" } },
      { key: "sourdough", item: "sourdough bread", amount: 2, unit: "slices", grams: 70, category: "Bakery", nutritionLookup: { source: "USDA FoodData Central", query: "Bread, sourdough", status: "pending-match" } },
      { key: "avocado", item: "avocado", amount: 0.5, unit: "medium", grams: 75, category: "Produce", nutritionLookup: { source: "USDA FoodData Central", query: "Avocados, raw, all commercial varieties", status: "pending-match" } }
    ],
    instructions: ["Cook the eggs until the whites are set and the yolks remain jammy.", "Toast the sourdough.", "Serve with measured avocado; season to taste."],
    portions: { alisa: "2 large eggs + 2 slices (70 g) sourdough + 75 g avocado", mom: "Adjust separately when planned" },
    storage: "Best prepared fresh.",
    nutrition: nutritionPending,
    quantification: { status: "usda-match-ready", calculationBasis: "grams", requiredNutrients: ["calories","protein","carbs","fat","fiber","saturatedFat","sugar","sodium"], note: "Ingredient weights and USDA search identities are defined. Nutrition remains pending until each search identity is resolved to a reviewed FDC ID; the engine will then calculate nutrients from grams." }
  },
  {
    id: "greek-chicken-feta-meatballs", name: "Greek chicken-feta meatballs",
    description: "Tender, herb-filled chicken meatballs with feta and lemon—built for Sunday dinner and flexible leftovers.",
    servings: 4, servingSize: "4–5 meatballs", prepTime: "20 minutes", cookTime: "20 minutes",
    tags: ["Greek-inspired", "Protein", "Meal prep"],
    ingredients: [
      { key: "ground-chicken", item: "ground chicken", amount: 1.25, unit: "lb", category: "Protein" },
      { key: "feta", item: "feta cheese", amount: 4, unit: "oz", category: "Dairy" },
      { key: "egg", item: "egg", amount: 1, unit: "", category: "Dairy" },
      { key: "panko", item: "panko breadcrumbs", amount: 0.5, unit: "cup", category: "Pantry" },
      { key: "parsley", item: "flat-leaf parsley", amount: 0.5, unit: "bunch", category: "Herbs" },
      { key: "lemon", item: "lemon", amount: 1, unit: "", category: "Produce" },
      { key: "oregano", item: "dried oregano", amount: 1, unit: "tsp", category: "Pantry", pantry: true },
      { key: "olive-oil", item: "olive oil", amount: 1, unit: "tbsp", category: "Pantry", pantry: true },
    ],
    instructions: ["Heat the oven to 425°F and line a sheet pan.", "Gently mix all ingredients except the olive oil; shape into evenly sized meatballs.", "Brush with olive oil and bake until browned and cooked through, about 16–20 minutes.", "Rest for 5 minutes and finish with lemon."],
    portions: { alisa: "4 meatballs with ¾ cup rice and salad", mom: "3 meatballs with ½ cup rice and extra salad" },
    storage: "Refrigerate in a sealed container for up to 4 days. Reheat gently or serve at room temperature.", nutrition: nutritionPending,
  },
  {
    id: "cucumber-carrot-herb-salad", name: "Cucumber, carrot & herb salad", description: "A crisp lemony side that carries fresh herbs across the week.", servings: 4, servingSize: "about 1 cup", prepTime: "15 minutes", cookTime: "0 minutes", tags: ["Mediterranean", "Fresh", "Vegetarian"],
    ingredients: [
      { key: "cucumber", item: "Persian cucumbers", amount: 4, unit: "", category: "Produce" }, { key: "carrots", item: "carrots", amount: 3, unit: "", category: "Produce" },
      { key: "parsley", item: "flat-leaf parsley", amount: 0.5, unit: "bunch", category: "Herbs" }, { key: "dill", item: "fresh dill", amount: 0.5, unit: "bunch", category: "Herbs" },
      { key: "lemon", item: "lemon", amount: 1, unit: "", category: "Produce" }, { key: "olive-oil", item: "olive oil", amount: 2, unit: "tbsp", category: "Pantry", pantry: true },
    ], instructions: ["Slice the cucumbers and shave the carrots into ribbons.", "Toss with chopped herbs, lemon juice, olive oil, salt, and pepper just before serving."],
    portions: { alisa: "1 generous cup", mom: "1 generous cup" }, storage: "Keep vegetables and dressing separate for up to 3 days.", nutrition: nutritionPending,
  },
  {
    id: "mediterranean-lemon-dill-sauce", name: "Mediterranean lemon-dill sauce", description: "A cool, bright yogurt sauce for meatballs, salads, and Friday’s use-it-up bowl.", servings: 6, servingSize: "2 tablespoons", prepTime: "10 minutes", cookTime: "0 minutes", tags: ["Mediterranean", "Sauce", "Vegetarian"],
    ingredients: [ { key: "greek-yogurt", item: "plain Greek yogurt", amount: 1, unit: "cup", category: "Dairy" }, { key: "dill", item: "fresh dill", amount: 0.5, unit: "bunch", category: "Herbs" }, { key: "lemon", item: "lemon", amount: 1, unit: "", category: "Produce" }, { key: "garlic-oil", item: "garlic-infused olive oil", amount: 1, unit: "tbsp", category: "Pantry", pantry: true } ],
    instructions: ["Stir the yogurt, finely chopped dill, lemon zest and juice, and garlic oil together.", "Season to taste and chill for 15 minutes before serving."], portions: { alisa: "2 tablespoons", mom: "2 tablespoons" }, storage: "Refrigerate for up to 4 days; stir before serving.", nutrition: nutritionPending,
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
    { day: "Sunday", meals: { breakfast: ["jammy-eggs-sourdough-avocado"], lunch: [{ label: "Mediterranean chicken-feta chopped salad + sourdough", nutrition: { calories: 450, protein: 38, fiber: 7, saturatedFat: 5 } }], dinner: ["greek-chicken-feta-meatballs", "cucumber-carrot-herb-salad", "mediterranean-lemon-dill-sauce"], snack: ["sesame-tahini-ribbon-salad"] }, theme: "Mediterranean table", note: "Serve dinner with basmati rice." },
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
  ["sesame-oil", "Toasted sesame oil", "Have"], ["dijon", "Dijon mustard", "Have"], ["tahini", "Tahini", "Use First"],
  ["sesame-seeds", "Sesame seeds", "Have"], ["tajin", "Tajín", "Have"], ["brown-sugar", "Brown sugar / honey", "Have"],
  ["oregano", "Oregano", "Have"], ["cumin", "Cumin", "Have"], ["smoked-paprika", "Smoked paprika", "Have"],
  ["zaatar", "Za’atar / sumac", "Use First"], ["black-pepper", "Black pepper", "Have"], ["chile-flakes", "Chile flakes", "Have"],
].map(([key, name, status]) => ({ key, name, status }));

export const pantryStatuses = ["Have", "Low", "Buy", "Use First"];
