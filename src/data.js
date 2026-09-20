export const nutritionTargets = { calories: 1750, protein: 125, proteinUpper: 130, fiber: 25, fiberUpper: 30, saturatedFatMax: 15, trackingMetrics: ["calories","protein","carbs","fat","fiber","saturatedFat","sugar","sodium"], primaryMetrics: ["calories","protein","fiber","saturatedFat"] };
export const nutritionSource = { primary: "USDA FoodData Central", tracking: "MyFitnessPal", policy: "USDA-calculated values become planning values only after ingredient quantities and servings are quantified. MyFitnessPal is a reconciliation check, not the calculation source." };

export const mealGenerationPolicy = {
  mode: "whole-day-and-week",
  person: "Alisa",
  dailyTargetsRef: "nutritionTargets",
  rules: {
    fixedMeals: "Keep meals already selected for the week unless the user changes them.",
    flexibleMeals: "Generate unfilled breakfasts, lunches, dinners, and snacks to complement fixed meals and close daily nutrition gaps.",
    portions: "Adjust the serving size of a complete composed recipe and genuinely separate sides before replacing a fixed meal. Never assume equal shares of a household recipe.",
    flavorContract: "Preserve each recipe's composition and flavor ratios. Dressing, sauce, marinade, seasoning, toppings, and other flavor components scale with the food they season; never independently reduce them merely to satisfy nutrition targets.",
    independentLevers: "Use genuinely separate sides such as bread, rice, potatoes, fruit, or snacks as independent nutrition levers. A protein may be adjusted independently only when it is a separately portionable component and its intended seasoning, sauce, or marinade ratio is preserved.",
    validation: "Do not mark a generated day complete until all planned components are quantified and the day has been tested against the active nutrition targets.",
    weeklyVariety: "Use two proven favorites, one variation, and one experiment while avoiding unnecessary repetition.",
    waste: "After nutrition requirements are satisfied, favor ingredients already used elsewhere in the week and respect Sunday shopping, Wednesday freshness pickup, perishability, and carryover.",
    saturatedFat: "Do not add saturated fat merely to fill calories; prefer appropriate unsaturated-fat or carbohydrate levers when the day has room.",
  },
  mealRoles: {
    fixed: "Selected meal; generator may adjust its composed serving size and genuine separate sides but does not silently replace it or alter its flavor ratios.",
    flexible: "Generator chooses the meal using the remaining day and week requirements.",
    open: "Intentionally unplanned restaurant/flexible slot; remains unscored until quantified.",
  },
  household: {
    alisa: "Generate from Alisa's active targets.",
    mom: "Generate separately from Mom's targets; Alisa target changes must not alter Mom's portions.",
  },
  publicationGate: "A week may be proposed before all recipes are quantified, but target-fit nutrition and exact Prep/Shopping quantities must remain pending until every planned component needed for those calculations is quantified.",
};

const nutritionPending = { calories:"To be calculated", protein:"To be calculated", carbs:"To be calculated", fat:"To be calculated", fiber:"To be calculated", saturatedFat:"To be calculated", sugar:"To be calculated", sodium:"To be calculated", status:"pending", source:"USDA FoodData Central", mfpStatus:"not checked" };


export const recipeStandardizationPolicy = {
  version: 1,
  purpose: "Convert saved/source recipes into calculation-ready Family Kitchen recipes without changing their intended flavor.",
  stages: [
    { id: "source", label: "Source saved", requires: ["recipe name", "source or provenance"] },
    { id: "ingredients", label: "Ingredients standardized", requires: ["ingredient identity", "amount", "unit", "gram equivalent or measurable basis"] },
    { id: "nutrition", label: "USDA matched", requires: ["USDA record or documented product source for each material ingredient", "all required nutrients calculated"] },
    { id: "portioning", label: "Portion ready", requires: ["flavor-locked components identified", "independent sides identified", "scalable serving basis"] },
    { id: "validated", label: "Planning ready", requires: ["complete nutrition", "portion strategy", "Prep/Shopping quantities can be derived"] },
  ],
  requiredNutrients: ["calories", "protein", "carbs", "fat", "fiber", "saturatedFat", "sugar", "sodium"],
  ingredientRules: {
    identity: "Use the specific food or product needed for nutrition matching; do not silently substitute a generic ingredient when the recipe depends on a specific form.",
    quantities: "Keep familiar kitchen measures for display and store gram-equivalent or otherwise measurable quantities for calculation.",
    variants: "Protein leanness, chicken breast vs thigh, yogurt fat percentage, and similar allowed variants remain optimization choices when the recipe still works as intended.",
    unknowns: "Never guess an unknown amount, package size, yield, or nutrition value. Keep the recipe pending until it is measured or confirmed.",
  },
  flavorRules: {
    contract: "Sauce, dressing, marinade, seasoning, and toppings that define the recipe scale with the food they season.",
    independent: "Only genuine separate sides or separately portionable components may be scaled independently.",
    substitutions: "Automatic substitutions are allowed only when they preserve the recipe's intended flavor and structure.",
  },
  nutritionRules: {
    primarySource: "USDA FoodData Central",
    brandedException: "Use a documented manufacturer value when a branded ingredient materially differs from a generic USDA food.",
    mfpRole: "MyFitnessPal is a reconciliation check after Family Kitchen calculation, not the primary source.",
    incomplete: "A recipe with any material unquantified component must remain pending and cannot supply exact day/week totals.",
  },
  outputs: ["recipe nutrition", "scalable component nutrition", "person-specific portions", "Prep quantities", "Shopping quantities", "MyFitnessPal import-ready recipe"],
};

export const recipeStandardizationStatus = (recipe) => {
  const status = recipe?.quantification?.status || recipe?.nutrition?.status || "candidate";
  if (["usda-calculated", "validated", "complete"].includes(status)) return "validated";
  if (status.includes("portion")) return "portioning";
  if (status.includes("usda") || status.includes("nutrition")) return "nutrition";
  if (status.includes("standard") || (recipe?.ingredients?.length && recipe.ingredients.every((ingredient) => ingredient.amount !== null && ingredient.amount !== undefined))) return "ingredients";
  return "source";
};

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
    id: "dirty-cabbage", name: "Dirty Cabbage",
    proteinType: "flexible",
    description: "Previously shared East Coast Kitchen recipe restored to the Family Kitchen recipe library.",
    category: "main", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Previously Shared", "Want to Try"], sourceRecipe: { source: "East Coast Kitchen", url: "https://theeastcoastkitchen.com/dirty-cabbage-recipe-easy-one-pot-dinner/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Family Kitchen standardization will preserve the recipe’s flavor before nutrition calculation."],
    portions: { alisa: "Pending standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Restored source recipe. Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized." }
  },
  {
    id: "tuna-rice-bowl", name: "Tuna Rice Bowl",
    proteinType: "ahi-tuna",
    description: "Previously shared East Coast Kitchen recipe restored to the Family Kitchen recipe library.",
    category: "main", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Previously Shared", "Want to Try"], sourceRecipe: { source: "East Coast Kitchen", url: "https://theeastcoastkitchen.com/tuna-rice-bowl-canned-tuna-sushi-vibe-hack/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Family Kitchen standardization will preserve the recipe’s flavor before nutrition calculation."],
    portions: { alisa: "Pending standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Restored source recipe. Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized." }
  },
  {
    id: "salmon-rice-bowl", name: "Salmon Rice Bowl",
    proteinType: "salmon",
    description: "Previously shared East Coast Kitchen recipe restored to the Family Kitchen recipe library.",
    category: "main", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Previously Shared", "Want to Try"], sourceRecipe: { source: "East Coast Kitchen", url: "https://theeastcoastkitchen.com/salmon-rice-bowl-one-pan-big-flavor/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Family Kitchen standardization will preserve the recipe’s flavor before nutrition calculation."],
    portions: { alisa: "Pending standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Restored source recipe. Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized." }
  },
  {
    id: "spicy-salmon-cucumber-boats", name: "Spicy Salmon Cucumber Boats",
    proteinType: "salmon",
    description: "Previously shared East Coast Kitchen recipe restored to the Family Kitchen recipe library.",
    category: "main", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Previously Shared", "Want to Try"], sourceRecipe: { source: "East Coast Kitchen", url: "https://theeastcoastkitchen.com/spicy-salmon-cucumber-boats-using-leftover-ingredients/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Family Kitchen standardization will preserve the recipe’s flavor before nutrition calculation."],
    portions: { alisa: "Pending standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Restored source recipe. Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized." }
  },
  {
    id: "no-grill-chicken-kebab", name: "No-Grill Chicken Kebab",
    proteinType: "chicken",
    description: "Previously shared East Coast Kitchen recipe restored to the Family Kitchen recipe library.",
    category: "main", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Previously Shared", "Want to Try"], sourceRecipe: { source: "East Coast Kitchen", url: "https://theeastcoastkitchen.com/chicken-kebab-without-a-grill-in-30-minutes/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Family Kitchen standardization will preserve the recipe’s flavor before nutrition calculation."],
    portions: { alisa: "Pending standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Restored source recipe. Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized." }
  },
  {
    id: "greek-chicken", name: "Greek Chicken",
    proteinType: "chicken",
    description: "Previously shared East Coast Kitchen recipe restored to the Family Kitchen recipe library.",
    category: "main", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Previously Shared", "Want to Try"], sourceRecipe: { source: "East Coast Kitchen", url: "https://theeastcoastkitchen.com/greek-chicken-the-easiest-dinner-youll-make/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Family Kitchen standardization will preserve the recipe’s flavor before nutrition calculation."],
    portions: { alisa: "Pending standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Restored source recipe. Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized." }
  },
  {
    id: "kibbeh-spiced-lamb-skewers", name: "Kibbeh-Spiced Lamb Skewers", description: "Lebanese-inspired spiced lamb skewers with tenderizing onion and bright citrus notes.",
    proteinType: "lamb",
    category: "main", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Candidate", "Want to Try"], sourceRecipe: { source: "Delish", url: "https://www.delish.com/cooking/recipe-ideas/a60129910/kibbeh-spiced-lamb-skewers-recipe/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Standardized Family Kitchen ingredients and adapted instructions will be added before nutrition calculation."],
    portions: { alisa: "Pending recipe standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized and nutrition is calculated." }
  },
  {
    id: "harissa-grilled-chicken", name: "Harissa Grilled Chicken", description: "Harissa-marinated grilled chicken with bold North African-inspired flavor.",
    proteinType: "chicken",
    category: "main", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Candidate", "Want to Try"], sourceRecipe: { source: "Delish", url: "https://www.delish.com/cooking/recipe-ideas/a40208036/harissa-grilled-chicken-recipe/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Standardized Family Kitchen ingredients and adapted instructions will be added before nutrition calculation."],
    portions: { alisa: "Pending recipe standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized and nutrition is calculated." }
  },
  {
    id: "greek-lemon-potatoes", name: "Greek Lemon Potatoes", description: "Lemony Greek-style potatoes for pairing with chicken, fish, or other mains.",
    proteinType: "none",
    category: "side", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Candidate", "Want to Try"], sourceRecipe: { source: "Delish", url: "https://www.delish.com/cooking/recipe-ideas/a39440405/greek-lemon-potatoes-recipe/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Standardized Family Kitchen ingredients and adapted instructions will be added before nutrition calculation."],
    portions: { alisa: "Pending recipe standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized and nutrition is calculated." }
  },
  {
    id: "halloumi-salad", name: "Halloumi Salad", description: "A substantial salad built around savory halloumi and fresh vegetables.",
    proteinType: "vegetarian",
    category: "meal-salad", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Candidate", "Want to Try"], sourceRecipe: { source: "Delish", url: "https://www.delish.com/cooking/recipe-ideas/a36321546/halloumi-salad-recipe/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Standardized Family Kitchen ingredients and adapted instructions will be added before nutrition calculation."],
    portions: { alisa: "Pending recipe standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized and nutrition is calculated." }
  },
  {
    id: "pasta-alla-norma", name: "Pasta alla Norma", description: "Sicilian-style pasta with eggplant, tomato, basil, and cheese.",
    proteinType: "vegetarian",
    category: "main", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Candidate", "Want to Try"], sourceRecipe: { source: "Delish", url: "https://www.delish.com/cooking/recipe-ideas/a34151085/pasta-alla-norma-recipe/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Standardized Family Kitchen ingredients and adapted instructions will be added before nutrition calculation."],
    portions: { alisa: "Pending recipe standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized and nutrition is calculated." }
  },
  {
    id: "skordalia", name: "Skordalia", description: "A garlicky Greek potato dip or side for Mediterranean plates.",
    proteinType: "none",
    category: "side", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Candidate", "Want to Try"], sourceRecipe: { source: "Delish", url: "https://www.delish.com/cooking/recipe-ideas/a30778443/skordalia-recipe/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Standardized Family Kitchen ingredients and adapted instructions will be added before nutrition calculation."],
    portions: { alisa: "Pending recipe standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized and nutrition is calculated." }
  },
  {
    id: "tahini-date-banana-shake", name: "Tahini Date Banana Shake", description: "A creamy tahini, date, and banana shake reserved as an intentional treat.",
    proteinType: "vegetarian",
    category: "treat", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Candidate", "Want to Try"], sourceRecipe: { source: "The Mediterranean Dish", url: "https://www.themediterraneandish.com/tahini-date-banana-shake/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Standardized Family Kitchen ingredients and adapted instructions will be added before nutrition calculation."],
    portions: { alisa: "Pending recipe standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized and nutrition is calculated." }
  },
  {
    id: "sweet-potato-hash", name: "Sweet Potato Hash", description: "A savory sweet-potato hash candidate for breakfast or brunch.",
    proteinType: "vegetarian",
    category: "breakfast", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Candidate", "Want to Try"], sourceRecipe: { source: "The Mediterranean Dish", url: "https://www.themediterraneandish.com/sweet-potato-hash-recipe/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Standardized Family Kitchen ingredients and adapted instructions will be added before nutrition calculation."],
    portions: { alisa: "Pending recipe standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized and nutrition is calculated." }
  },
  {
    id: "roasted-branzino", name: "Roasted Branzino", description: "Whole roasted branzino for a fresh Mediterranean seafood meal.",
    proteinType: "white-fish",
    category: "main", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Candidate", "Want to Try"], sourceRecipe: { source: "The Mediterranean Dish", url: "https://www.themediterraneandish.com/roasted-branzino-recipe/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Standardized Family Kitchen ingredients and adapted instructions will be added before nutrition calculation."],
    portions: { alisa: "Pending recipe standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized and nutrition is calculated." }
  },
  {
    id: "baked-cod-lemon-garlic", name: "Baked Cod with Lemon & Garlic", description: "Baked white fish with lemon and garlic for a lighter seafood main.",
    proteinType: "white-fish",
    category: "main", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Candidate", "Want to Try"], sourceRecipe: { source: "The Mediterranean Dish", url: "https://www.themediterraneandish.com/baked-cod-recipe-lemon-garlic/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Standardized Family Kitchen ingredients and adapted instructions will be added before nutrition calculation."],
    portions: { alisa: "Pending recipe standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized and nutrition is calculated." }
  },
  {
    id: "mediterranean-lettuce-salad", name: "Mediterranean Lettuce Salad", description: "A fresh lettuce-based side salad for balancing richer mains.",
    proteinType: "none",
    category: "side", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Candidate", "Want to Try"], sourceRecipe: { source: "The Mediterranean Dish", url: "https://www.themediterraneandish.com/lettuce-salad-recipe/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Standardized Family Kitchen ingredients and adapted instructions will be added before nutrition calculation."],
    portions: { alisa: "Pending recipe standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized and nutrition is calculated." }
  },
  {
    id: "mediterranean-quinoa-salad", name: "Mediterranean Quinoa Salad", description: "Quinoa salad candidate adapted for this kitchen without scallions or onions.",
    proteinType: "vegetarian",
    category: "side", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Candidate", "Want to Try"], sourceRecipe: { source: "The Mediterranean Dish", url: "https://www.themediterraneandish.com/quinoa-salad/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Standardized Family Kitchen ingredients and adapted instructions will be added before nutrition calculation."],
    portions: { alisa: "Pending recipe standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized and nutrition is calculated." }
  },
  {
    id: "baba-ganoush", name: "Baba Ganoush", description: "Smoky eggplant dip for vegetables, rice-paper crisps, or Mediterranean plates.",
    proteinType: "none",
    category: "side", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Candidate", "Want to Try"], sourceRecipe: { source: "Serious Eats", url: "https://www.seriouseats.com/the-best-baba-ganoush-recipe", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Standardized Family Kitchen ingredients and adapted instructions will be added before nutrition calculation."],
    portions: { alisa: "Pending recipe standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized and nutrition is calculated." }
  },
  {
    id: "watermelon-cucumber-feta-salad", name: "Watermelon Cucumber Feta Salad", description: "Fresh watermelon, cucumber, and feta salad for warm-weather meals.",
    proteinType: "vegetarian",
    category: "side", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Candidate", "Want to Try"], sourceRecipe: { source: "The Mediterranean Dish", url: "https://www.themediterraneandish.com/watermelon-salad-with-cucumber-feta/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Standardized Family Kitchen ingredients and adapted instructions will be added before nutrition calculation."],
    portions: { alisa: "Pending recipe standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized and nutrition is calculated." }
  },
  {
    id: "preserved-lemons", name: "Preserved Lemons", description: "A make-ahead preserved-lemon pantry project for future sauces, marinades, and meals.",
    proteinType: "none",
    category: "pantry-prep", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Candidate", "Want to Try"], sourceRecipe: { source: "Serious Eats", url: "https://www.seriouseats.com/how-to-make-preserved-lemons", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Standardized Family Kitchen ingredients and adapted instructions will be added before nutrition calculation."],
    portions: { alisa: "Pending recipe standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized and nutrition is calculated." }
  },
  {
    id: "bun-thit-nuong", name: "Bún Thịt Nướng", description: "Vietnamese grilled pork vermicelli bowl with fresh herbs and vegetables.",
    proteinType: "pork",
    category: "main", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Candidate", "Want to Try"], sourceRecipe: { source: "Cooking Therapy", url: "https://www.cooking-therapy.com/bun-thit-nuong/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Standardized Family Kitchen ingredients and adapted instructions will be added before nutrition calculation."],
    portions: { alisa: "Pending recipe standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized and nutrition is calculated." }
  },
  {
    id: "vietnamese-pork-noodle-bowls", name: "Vietnamese Pork Noodle Bowls", description: "Vietnamese-style pork noodle bowls with fresh vegetables, herbs, and a punchy dressing.",
    proteinType: "pork",
    category: "main", servings: "Source recipe", servingSize: "Pending quantification", prepTime: "See source", cookTime: "See source",
    tags: ["Candidate", "Want to Try"], sourceRecipe: { source: "RecipeTin Eats", url: "https://www.recipetineats.com/vietnamese-pork-noodle-bowls/", status: "candidate-not-yet-standardized" },
    ingredients: [], instructions: ["Open the source recipe for the original method. Standardized Family Kitchen ingredients and adapted instructions will be added before nutrition calculation."],
    portions: { alisa: "Pending recipe standardization and nutrition engine", mom: "Generated separately after standardization" },
    storage: "Pending recipe review.", nutrition: { ...nutritionPending },
    quantification: { status: "candidate", note: "Do not use for exact Prep, Shopping, or nutrition totals until ingredients are standardized and nutrition is calculated." }
  },
  {
    id: "ericas-pasta-sauce", name: "Erica’s Pasta Sauce",
    proteinType: "pork",
    description: "Erica’s long-simmered tomato sauce with red bell pepper, basil, garlic, onion, and deli Salamino Piccante. Preserved as the original family/friend recipe; nutrition quantities will be standardized before calculation.",
    category: "main",
    servings: 1, servingSize: "Batch quantity pending standardization", prepTime: "20 minutes", cookTime: "3–6 hours",
    tags: ["Italian-inspired", "Pasta", "Want to Try"],
    ingredients: [
      { key: "olive-oil", item: "extra-virgin olive oil", amount: null, unit: "enough to cover saucepan bottom", category: "Pantry", quantificationStatus: "needs-standardization" },
      { key: "yellow-onion", item: "yellow onion, diced", amount: 1, unit: "", category: "Produce" },
      { key: "garlic", item: "garlic cloves, chopped", amount: 4, unit: "cloves", category: "Produce" },
      { key: "red-bell-pepper", item: "red bell pepper, diced", amount: 1, unit: "", category: "Produce" },
      { key: "salamino-piccante", item: "deli Salamino Piccante, sliced", amount: 1, unit: "deli stick", category: "Protein", quantificationStatus: "weigh-at-standardization" },
      { key: "diced-tomatoes", item: "canned diced tomatoes", amount: 2, unit: "large cans", category: "Pantry", quantificationStatus: "record-can-size" },
      { key: "black-pepper", item: "black pepper", amount: 0.5, unit: "Tbsp", category: "Pantry" },
      { key: "sugar", item: "sugar", amount: null, unit: "a couple pinches", category: "Pantry", quantificationStatus: "needs-standardization" },
      { key: "red-pepper-flakes", item: "crushed red pepper flakes", amount: null, unit: "a couple pinches", category: "Pantry", quantificationStatus: "needs-standardization" },
      { key: "tomato-sauce", item: "canned tomato sauce", amount: 2, unit: "large cans", category: "Pantry", quantificationStatus: "record-can-size" },
      { key: "fresh-basil", item: "fresh basil leaves", amount: null, unit: "to taste", category: "Produce", quantificationStatus: "needs-standardization" }
    ],
    instructions: [
      "Cover the bottom of a large saucepan with olive oil and heat the pan.",
      "Add the garlic and onion and sauté.",
      "Add the red bell pepper and sliced Salamino Piccante.",
      "Add the diced tomatoes, black pepper, sugar, and crushed red pepper flakes. Lower the heat and simmer for 1½–3 hours.",
      "Add the tomato sauce and fresh basil leaves. Simmer for another 1½–3 hours.",
      "Remove the basil leaves and serve with cooked pasta."
    ],
    portions: { alisa: "Generated after sauce and pasta are quantified", mom: "Generated separately from Mom’s target" },
    portionStrategy: { mode: "nutrition-target", fixedServing: false, flavorContract: "Keep Erica’s sauce recipe intact. Adjust the finished sauce and pasta serving sizes around the day’s nutrition targets rather than independently reducing flavor ingredients." },
    storage: "Refrigerate or freeze using standard cooked tomato-sauce food-safety guidance.",
    nutrition: { calories: "Pending", protein: "Pending", carbs: "Pending", fat: "Pending", fiber: "Pending", saturatedFat: "Pending", sugar: "Pending", sodium: "Pending", status: "pending-standardization", source: "USDA FoodData Central after quantities are standardized", mfpStatus: "not checked" },
    quantification: { status: "needs-standardization", displaySystem: "US customary kitchen measures", note: "Original recipe intentionally retains informal quantities. EVOO, deli Salamino Piccante weight, can sizes, sugar, basil, and red pepper flakes must be measured before USDA calculation." }
  },
  {
    id: "jammy-eggs-sourdough-avocado", name: "Jammy eggs + sourdough + avocado",
    proteinType: "eggs",
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
    proteinType: "chicken",
    description: "Tender, herb-filled chicken meatballs with feta and lemon—built for Sunday dinner and flexible leftovers.",
    servings: 4, servingSize: "Target-generated portion", prepTime: "20 minutes", cookTime: "20 minutes",
    tags: ["Greek-inspired", "Protein", "Meal prep"],
    ingredients: [
      { key: "ground-chicken", item: "ground chicken", amount: 1.25, unit: "lb", grams: 567, category: "Protein", nutritionRole: "variable-protein", nutritionOptions: [{ label: "USDA generic ground chicken", source: "USDA FoodData Central", lookupQuery: "Chicken, ground, with additives, raw", dataType: "Foundation", status: "verified-generic" }], brandedOptionsPolicy: "A stated lean/fat ratio such as 93/7 or 98/2 may be added only when it is backed by a specific verified branded FoodData Central record or package Nutrition Facts record.", selectionRule: "Choose among verified nutrient records using the full-day nutrition target; never infer a lean/fat ratio from the generic USDA ground-chicken record." },
      { key: "feta", item: "Dodoni Feta in Brine", amount: 4, unit: "oz", grams: 113.4, category: "Dairy", productRegistryKey: "feta", quantification: { status: "quantified", basis: "exact ounce-to-gram conversion" }, nutritionLookup: { status: "needs-label-match", source: "preferred pantry product registry" } },
      { key: "egg", item: "large egg", amount: 1, unit: "", grams: 50, category: "Dairy", quantification: { status: "quantified", basis: "USDA standard large whole egg edible portion" }, nutritionLookup: { source: "USDA FoodData Central", lookupQuery: "egg whole raw fresh large", status: "needs-final-record-match" } },
      { key: "panko", item: "Kikkoman Panko, plain", amount: 0.5, unit: "cup", category: "Pantry", productRegistryKey: "panko", quantification: { status: "needs-label-weight", reason: "Cup-to-gram weight must come from the preferred product label or a measured kitchen weight; do not guess." }, nutritionLookup: { status: "needs-label-match", source: "preferred pantry product registry" } },
      { key: "parsley", item: "flat-leaf parsley", amount: 0.5, unit: "bunch", category: "Herbs", quantification: { status: "needs-standard-edible-grams", reason: "Bunch size varies; retain half-bunch for shopping and weigh edible leaves/stems for nutrition." }, nutritionLookup: { source: "USDA FoodData Central", lookupQuery: "parsley fresh", status: "needs-final-record-match" } },
      { key: "lemon", item: "lemon", amount: 1, unit: "", category: "Produce", quantification: { status: "needs-recipe-yield", reason: "Recipe finishes with lemon; record the actual juice/zest used rather than assigning nutrition for a whole lemon." }, nutritionLookup: { source: "USDA FoodData Central", lookupQuery: "lemon juice raw", status: "needs-final-record-match" } },
      { key: "oregano", item: "dried oregano", amount: 1, unit: "tsp", category: "Pantry", pantry: true, quantification: { status: "needs-usda-gram-equivalent" }, nutritionLookup: { source: "USDA FoodData Central", lookupQuery: "spices oregano dried", status: "needs-final-record-match" } },
      { key: "olive-oil", item: "California Olive Ranch Extra Virgin Olive Oil", amount: 1, unit: "tbsp", category: "Pantry", pantry: true, productRegistryKey: "olive-oil", quantification: { status: "needs-label-weight", reason: "Use preferred product serving weight before nutrition calculation." }, nutritionLookup: { status: "needs-label-match", source: "preferred pantry product registry" } },
    ],
    instructions: ["Heat the oven to 425°F and line a sheet pan.", "Gently mix all ingredients except the olive oil; shape into evenly sized meatballs.", "Brush with olive oil and bake until browned and cooked through, about 16–20 minutes.", "Rest for 5 minutes and finish with lemon."],
    portions: { alisa: "Generated from Alisa's active nutrition target", mom: "Generated separately from Mom's nutrition target" },
    portionStrategy: { mode: "nutrition-target", fixedMeatballCount: false, wastePriority: "After nutrition targets are satisfied, size the batch and portions to minimize planned leftovers." },
    storage: "Refrigerate in a sealed container for up to 4 days. Reheat gently or serve at room temperature.", nutrition: nutritionPending,
  },
  {
    id: "cucumber-carrot-herb-salad", name: "Cucumber, carrot & herb salad", description: "A crisp lemony side that carries fresh herbs across the week.", servings: 4, servingSize: "about 1 cup", prepTime: "15 minutes", cookTime: "0 minutes", tags: ["Mediterranean", "Fresh", "Vegetarian"],
    proteinType: "none",
    ingredients: [
      { key: "cucumber", item: "Persian cucumbers", amount: 4, unit: "", category: "Produce", quantification: { status: "needs-standard-edible-grams", reason: "Produce count varies by size; retain count for shopping and use edible grams for nutrition." } }, { key: "carrots", item: "carrots", amount: 3, unit: "", category: "Produce", quantification: { status: "needs-standard-edible-grams" } },
      { key: "parsley", item: "flat-leaf parsley", amount: 0.5, unit: "bunch", category: "Herbs", quantification: { status: "needs-standard-edible-grams" } }, { key: "dill", item: "fresh dill", amount: 0.5, unit: "bunch", category: "Herbs", quantification: { status: "needs-standard-edible-grams" } },
      { key: "lemon", item: "lemon", amount: 1, unit: "", category: "Produce", quantification: { status: "needs-juice-grams" } }, { key: "olive-oil", item: "olive oil", amount: 2, unit: "tbsp", grams: 27, category: "Pantry", pantry: true },
    ], instructions: ["Slice the cucumbers and shave the carrots into ribbons.", "Toss with chopped herbs, lemon juice, olive oil, salt, and pepper just before serving."],
    portions: { alisa: "Generated from Alisa's active nutrition target", mom: "Generated separately from Mom's nutrition target" }, portionStrategy: { mode: "nutrition-target", fixedCupServing: false }, storage: "Keep vegetables and dressing separate for up to 3 days.", nutrition: nutritionPending,
  },
  {
    id: "mediterranean-lemon-dill-sauce", name: "Mediterranean lemon-dill Dijon sauce", description: "A cool, bright yogurt sauce with dill and Dijon for meatballs, salads, and Friday’s use-it-up bowl.", servings: 1, servingSize: "Target-generated portion from measured batch", prepTime: "10 minutes", cookTime: "0 minutes", tags: ["Mediterranean", "Sauce", "Vegetarian"],
    proteinType: "none",
    ingredients: [
      { key: "greek-yogurt", item: "FAGE Total 2% Plain Greek Yogurt", amount: 0.5, unit: "cup", category: "Dairy", productRegistryKey: "greek-yogurt", nutritionRole: "preferred-product", quantification: { status: "needs-label-weight", reason: "Retain the recipe cup measure; use FAGE label serving weight or a measured kitchen weight for nutrition." }, nutritionLookup: { status: "needs-label-match", source: "preferred pantry product registry" } },
      { key: "olive-oil", item: "California Olive Ranch Extra Virgin Olive Oil", amount: 1, unit: "tbsp", grams: 13.5, category: "Pantry", pantry: true, productRegistryKey: "olive-oil", nutritionLookup: { source: "USDA FoodData Central", query: "olive oil", fdcId: 748608, dataType: "Foundation", status: "matched", note: "Generic olive-oil nutrient record is acceptable for the preferred pure EVOO; brand remains the shopping default." }, quantification: { status: "quantified", gramsPerTablespoon: 13.5 } },
      { key: "lemon-juice", item: "fresh lemon juice", amount: 2, unit: "tbsp", grams: 30, category: "Produce", nutritionLookup: { source: "USDA FoodData Central", query: "lemon juice raw", fdcId: 167747, dataType: "SR Legacy", status: "matched" } },
      { key: "dill", item: "fresh dill, finely chopped", amount: 2, unit: "tbsp", category: "Herbs", quantification: { status: "needs-standard-grams" } },
      { key: "dijon", item: "Grey Poupon Dijon Mustard", amount: 1, unit: "tsp", grams: 5, category: "Pantry", pantry: true, nutritionLookup: { source: "manufacturer nutrition label", brand: "Grey Poupon", product: "Dijon Mustard", status: "matched", serving: { teaspoons: 1, grams: 5, calories: 5, protein: 0, carbs: 0, fat: 0, fiber: 0, saturatedFat: 0, sugar: 0, sodium: 115 } }, quantification: { status: "quantified", gramsPerTeaspoon: 5 } },
      { key: "garlic-oil", item: "FODY Garlic-Infused Extra Virgin Olive Oil", amount: 1, unit: "tsp", grams: 4.5, category: "Pantry", pantry: true, productRegistryKey: "garlic-oil", quantification: { status: "quantified", basis: "recipe teaspoon weight already standardized" }, nutritionLookup: { status: "needs-label-match", source: "preferred pantry product registry" } },
      { key: "black-pepper", item: "black pepper", amount: 1, unit: "to taste", category: "Pantry", pantry: true },
      { key: "salt", item: "salt", amount: 1, unit: "small pinch", category: "Pantry", pantry: true }
    ],
    instructions: ["Stir the yogurt, olive oil, lemon juice, finely chopped dill, Dijon, and garlic-infused oil together.", "Season with black pepper and a small pinch of salt; chill for 15 minutes before serving."], portions: { alisa: "Generated from Alisa's active nutrition target", mom: "Generated separately from Mom's nutrition target" }, portionStrategy: { mode: "nutrition-target", fixedTablespoonServing: false, batchMeasurement: "Store final batch weight in grams before assigning portions." }, storage: "Refrigerate for up to 4 days; stir before serving.", nutrition: nutritionPending,
  },
  {
    id: "vietnamese-chicken-cabbage-salad", name: "Vietnamese chicken cabbage salad", description: "Crunchy cabbage, tender chicken, herbs, and a lively lime-fish sauce dressing.", servings: 4, servingSize: "about 2 cups", prepTime: "25 minutes", cookTime: "15 minutes", tags: ["Vietnamese-inspired", "Salad", "High protein"],
    proteinType: "chicken",
    ingredients: [ { key: "chicken-breast", item: "boneless chicken breast", amount: 1.25, unit: "lb", category: "Protein" }, { key: "cabbage", item: "green cabbage", amount: 0.5, unit: "head", category: "Produce" }, { key: "carrots", item: "carrots", amount: 2, unit: "", category: "Produce" }, { key: "mint", item: "fresh mint", amount: 1, unit: "bunch", category: "Herbs" }, { key: "cilantro", item: "fresh cilantro", amount: 1, unit: "bunch", category: "Herbs" }, { key: "lime", item: "limes", amount: 2, unit: "", category: "Produce" }, { key: "fish-sauce", item: "fish sauce", amount: 2, unit: "tbsp", category: "Pantry", pantry: true }, { key: "brown-sugar", item: "brown sugar or honey", amount: 1, unit: "tbsp", category: "Pantry", pantry: true } ],
    instructions: ["Poach or pan-cook the chicken until cooked through, then rest and shred.", "Whisk lime juice, fish sauce, brown sugar, and a splash of water.", "Toss chicken with finely sliced cabbage, carrot, herbs, and dressing just before serving."], portions: { alisa: "2 cups with about 5 oz chicken", mom: "1½ cups with about 4 oz chicken" }, storage: "Refrigerate components separately for up to 3 days; dress only what you will eat.", nutrition: nutritionPending,
  },
  {
    id: "sushi-style-rice-bowl", name: "Sushi-style rice bowl", description: "A customizable bowl with sushi rice, crisp vegetables, avocado, and either ahi or cooked salmon.", servings: 2, servingSize: "1 composed bowl", prepTime: "20 minutes", cookTime: "20 minutes", tags: ["Japanese-inspired", "Bowl", "Fresh"],
    proteinType: "mixed-fish",
    ingredients: [ { key: "ahi", item: "sushi-grade ahi tuna", amount: 6, unit: "oz", category: "Protein", pickup: "wednesday" }, { key: "salmon", item: "salmon", amount: 6, unit: "oz", category: "Protein", pickup: "wednesday" }, { key: "sushi-rice", item: "sushi rice", amount: 1, unit: "cup", category: "Pantry", pantry: true }, { key: "cucumber", item: "Persian cucumbers", amount: 2, unit: "", category: "Produce", pickup: "wednesday" }, { key: "avocado", item: "ripe avocado", amount: 1, unit: "", category: "Produce", pickup: "wednesday" }, { key: "sprouts", item: "radish sprouts", amount: 1, unit: "pack", category: "Produce", pickup: "wednesday" }, { key: "rice-vinegar", item: "rice vinegar", amount: 2, unit: "tbsp", category: "Pantry", pantry: true }, { key: "sesame-seeds", item: "sesame seeds", amount: 1, unit: "tbsp", category: "Pantry", pantry: true } ],
    instructions: ["Cook and season the sushi rice with rice vinegar; cool until warm.", "Cook Mom’s salmon through. Keep Alisa’s ahi well chilled and slice with a clean knife just before serving.", "Arrange rice, fish, cucumber, avocado, and sprouts in each bowl; finish with sesame seeds and sauce."], portions: { alisa: "3 oz raw ahi, ¾ cup rice, and half the vegetables", mom: "3 oz cooked salmon, ½ cup rice, and half the vegetables" }, storage: "Serve fish the day it is purchased. Refrigerate cooked rice promptly and use within 1 day.", nutrition: nutritionPending,
  },
  {
    id: "japanese-ginger-sesame-sauce", name: "Japanese ginger-sesame sauce", description: "A savory, gingery drizzle for rice bowls and vegetables.", servings: 6, servingSize: "2 tablespoons", prepTime: "10 minutes", cookTime: "0 minutes", tags: ["Japanese-inspired", "Sauce", "Dairy-free"],
    proteinType: "none",
    ingredients: [ { key: "ginger", item: "fresh ginger", amount: 2, unit: "inch", category: "Produce", pickup: "wednesday" }, { key: "tamari", item: "low-sodium soy sauce or tamari", amount: 0.25, unit: "cup", category: "Pantry", pantry: true }, { key: "rice-vinegar", item: "rice vinegar", amount: 2, unit: "tbsp", category: "Pantry", pantry: true }, { key: "sesame-oil", item: "toasted sesame oil", amount: 1, unit: "tbsp", category: "Pantry", pantry: true }, { key: "brown-sugar", item: "brown sugar or honey", amount: 1, unit: "tsp", category: "Pantry", pantry: true } ],
    instructions: ["Finely grate the ginger.", "Whisk all ingredients until the sweetener dissolves; adjust with a spoonful of water if desired."], portions: { alisa: "2 tablespoons", mom: "1–2 tablespoons" }, storage: "Refrigerate for up to 1 week and shake well before using.", nutrition: nutritionPending,
  },
  {
    id: "use-it-up-bowl", name: "Friday use-it-up bowl", description: "A flexible formula, not a strict recipe: turn the week’s good leftovers into a fresh, composed dinner.", servings: 2, servingSize: "1 bowl", prepTime: "15 minutes", cookTime: "5 minutes", tags: ["Flexible", "Leftovers", "No-waste"],
    proteinType: "flexible",
    ingredients: [ { key: "leftover-protein", item: "remaining cooked protein", amount: 2, unit: "portions", category: "Other", optional: true }, { key: "leftover-rice", item: "remaining cooked rice", amount: 1.5, unit: "cups", category: "Other", optional: true }, { key: "cucumber", item: "remaining cucumber", amount: 1, unit: "", category: "Produce", optional: true }, { key: "carrots", item: "remaining carrots", amount: 1, unit: "", category: "Produce", optional: true }, { key: "cabbage", item: "remaining cabbage", amount: 0.25, unit: "head", category: "Produce", optional: true }, { key: "avocado", item: "remaining avocado", amount: 1, unit: "", category: "Produce", optional: true }, { key: "leftover-sauce", item: "existing sauce", amount: 4, unit: "tbsp", category: "Other", optional: true } ],
    instructions: ["Check the refrigerator and choose only leftovers that are still fresh.", "Reheat protein and rice safely, or serve cold when appropriate.", "Layer with crisp vegetables and herbs, then finish with an existing sauce."], portions: { alisa: "Build to appetite, prioritizing protein and vegetables", mom: "A smaller bowl with extra vegetables" }, storage: "This meal is intended to use leftovers; follow the storage guidance of each original component.", nutrition: nutritionPending,
  },
  {
    id: "brown-sugar-mayo-salmon", name: "Brown-sugar mayo glazed salmon", description: "An easy savory-sweet salmon with a burnished glaze for Saturday dinner.", servings: 4, servingSize: "1 salmon fillet", prepTime: "10 minutes", cookTime: "15 minutes", tags: ["Seafood", "Easy", "Family dinner"],
    proteinType: "salmon",
    ingredients: [ { key: "salmon", item: "salmon", amount: 1.5, unit: "lb", category: "Protein", pickup: "wednesday" }, { key: "mayonnaise", item: "mayonnaise", amount: 0.25, unit: "cup", category: "Pantry" }, { key: "brown-sugar", item: "brown sugar or honey", amount: 1, unit: "tbsp", category: "Pantry", pantry: true }, { key: "tamari", item: "low-sodium soy sauce or tamari", amount: 1, unit: "tbsp", category: "Pantry", pantry: true } ],
    instructions: ["Heat the oven to 425°F and place salmon on a lined sheet pan.", "Mix mayonnaise, brown sugar, and tamari; spread a thin layer over the fish.", "Roast until the center flakes and is cooked to your preferred doneness, about 10–15 minutes."], portions: { alisa: "5–6 oz salmon with ¾ cup rice", mom: "4 oz salmon with ½ cup rice" }, storage: "Refrigerate cooked salmon for up to 3 days.", nutrition: nutritionPending,
  },
  {
    id: "sesame-cucumber-carrot-salad", name: "Sesame cucumber & ribbon-carrot salad", description: "A crunchy, tangy salad to balance the glazed salmon.", servings: 4, servingSize: "about 1 cup", prepTime: "15 minutes", cookTime: "0 minutes", tags: ["Japanese-inspired", "Fresh", "Vegetarian"],
    proteinType: "none",
    ingredients: [ { key: "cucumber", item: "Persian cucumbers", amount: 4, unit: "", category: "Produce", pickup: "wednesday" }, { key: "carrots", item: "carrots", amount: 3, unit: "", category: "Produce" }, { key: "rice-vinegar", item: "rice vinegar", amount: 2, unit: "tbsp", category: "Pantry", pantry: true }, { key: "sesame-oil", item: "toasted sesame oil", amount: 1, unit: "tsp", category: "Pantry", pantry: true }, { key: "sesame-seeds", item: "sesame seeds", amount: 1, unit: "tbsp", category: "Pantry", pantry: true } ],
    instructions: ["Slice cucumbers and shave carrots into ribbons.", "Toss with rice vinegar and sesame oil; finish with sesame seeds just before serving."], portions: { alisa: "1 cup", mom: "1 cup" }, storage: "Best the day it is made; refrigerate undressed vegetables for up to 2 days.", nutrition: nutritionPending,
  },
  {
    id: "mediterranean-chicken-feta-chopped-salad", name: "Mediterranean chicken-feta chopped salad + sourdough", description: "A crisp Mediterranean lunch with chicken, feta, herbs, vegetables, lemon-Dijon dressing, and sourdough.", servings: 2, servingSize: "Target-generated portion", prepTime: "20 minutes", cookTime: "15 minutes", tags: ["Mediterranean", "Lunch", "High protein"],
    proteinType: "chicken",
    ingredients: [
      { key: "chicken-breast", item: "boneless skinless chicken breast", amount: 0.75, unit: "lb", grams: 340.2, category: "Protein", nutritionLookup: { source: "USDA FoodData Central", query: "chicken breast raw boneless skinless", fdcId: 2646170, dataType: "Foundation", status: "matched" } },
      { key: "cucumber", item: "Persian cucumbers", amount: 2, unit: "", grams: 200, category: "Produce", nutritionLookup: { source: "USDA FoodData Central", query: "cucumber with peel raw", fdcId: 2346406, dataType: "Foundation", status: "matched" }, quantification: { status: "standardized", basis: "100 g edible portion per Persian cucumber", verifyAtPrep: true } },
      { key: "carrots", item: "carrot", amount: 1, unit: "", grams: 61, category: "Produce", nutritionLookup: { source: "USDA FoodData Central", query: "carrots raw", fdcId: 170393, dataType: "SR Legacy", status: "matched" }, quantification: { status: "standardized", basis: "1 medium raw carrot = 61 g edible portion", verifyAtPrep: true } },
      { key: "cabbage", item: "green cabbage", amount: 2, unit: "cup", grams: 178, category: "Produce", nutritionLookup: { source: "USDA FoodData Central", query: "cabbage green raw", fdcId: 2346407, dataType: "Foundation", status: "matched" }, quantification: { status: "standardized", basis: "1 cup chopped raw green cabbage = 89 g", verifyAtPrep: true } },
      { key: "feta", item: "feta cheese", amount: 2, unit: "oz", grams: 56.7, category: "Dairy", nutritionLookup: { source: "USDA FoodData Central", query: "cheese feta", fdcId: 2259796, dataType: "Foundation", status: "matched" } },
      { key: "dill", item: "fresh dill", amount: 2, unit: "tbsp", grams: 6, category: "Herbs", nutritionLookup: { source: "USDA FoodData Central", query: "dill weed fresh", fdcId: 172233, dataType: "SR Legacy", status: "matched" }, quantification: { status: "standardized", basis: "1 tbsp chopped fresh dill = 3 g", verifyAtPrep: true } },
      { key: "parsley", item: "flat-leaf parsley", amount: 2, unit: "tbsp", grams: 8, category: "Herbs", nutritionLookup: { source: "USDA FoodData Central", query: "parsley fresh", fdcId: 170416, dataType: "SR Legacy", status: "matched" }, quantification: { status: "standardized", basis: "1 tbsp chopped fresh parsley = 4 g", verifyAtPrep: true } },
      { key: "lemon-juice", item: "fresh lemon juice", amount: 2, unit: "tbsp", grams: 30, category: "Produce", nutritionLookup: { source: "USDA FoodData Central", query: "lemon juice raw", fdcId: 167747, dataType: "SR Legacy", status: "matched" } },
      { key: "dijon", item: "Grey Poupon Dijon Mustard", amount: 1, unit: "tsp", grams: 5, category: "Pantry", pantry: true, nutritionLookup: { source: "manufacturer nutrition label", brand: "Grey Poupon", product: "Dijon Mustard", status: "matched", serving: { teaspoons: 1, grams: 5, calories: 5, protein: 0, carbs: 0, fat: 0, fiber: 0, saturatedFat: 0, sugar: 0, sodium: 115 } }, quantification: { status: "quantified", gramsPerTeaspoon: 5 } },
      { key: "olive-oil", item: "extra-virgin olive oil", amount: 1, unit: "tbsp", grams: 13.5, category: "Pantry", pantry: true, nutritionLookup: { source: "USDA FoodData Central", query: "extra virgin olive oil", fdcId: 748608, dataType: "Foundation", status: "matched" } },
      { key: "sourdough", item: "Izzio Artisan Bakery San Francisco Style Sourdough Bread", amount: 2, unit: "slice", grams: 56, category: "Bakery", nutritionLookup: { source: "manufacturer nutrition label", brand: "Izzio Artisan Bakery", product: "San Francisco Style Sourdough Bread, sliced", status: "matched", serving: { slices: 2, grams: 56, calories: 140, protein: 5, carbs: 29, fat: 0.5, fiber: 1, saturatedFat: 0, sugar: 0, sodium: 290 } }, quantification: { status: "quantified", gramsPerSlice: 28 } }
    ],
    instructions: ["Cook the chicken until browned and cooked through, then rest and slice.", "Whisk lemon juice, Dijon, and olive oil for the dressing.", "Chop the cucumber, carrot, cabbage, dill, and parsley; toss with the dressing.", "Top with sliced chicken and feta and serve with sourdough."],
    portions: { alisa: "Generated from Alisa's active nutrition target", mom: "Generated separately from Mom's nutrition target" },
    portionStrategy: {
      mode: "nutrition-target",
      fixedServing: false,
      flavorContract: "Scale the composed salad as one unit so chicken, vegetables, herbs, feta, and dressing retain their verified recipe ratios. Sourdough is a genuine separate side and may be adjusted independently.",
      components: [
        { id: "composed-salad", role: "flavor-locked", includes: ["chicken-breast","cucumber","carrots","cabbage","feta","dill","parsley","lemon-juice","dijon","olive-oil"], nutrition: { basis: "whole-component", calories: 770.16, protein: 91.88, carbs: 29.28, fat: 31.16, fiber: 7.64, saturatedFat: 9.78, sugar: 12.75, sodium: 1007.18, status: "calculated", source: "USDA FoodData Central + reviewed manufacturer label" } },
        { id: "sourdough-side", role: "independent-side", includes: ["sourdough"], nutrition: { basis: "whole-component", calories: 140, protein: 5, carbs: 29, fat: 0.5, fiber: 1, saturatedFat: 0, sugar: 0, sodium: 290, status: "calculated", source: "Izzio manufacturer nutrition label" } }
      ]
    },
    storage: "Keep chicken, chopped vegetables, dressing, and bread separate until serving.", nutrition: { status: "calculated", basis: "whole-recipe", calories: 910.16, protein: 96.88, carbs: 58.28, fat: 31.66, fiber: 8.64, saturatedFat: 9.78, sugar: 12.75, sodium: 1297.18, source: "USDA FoodData Central + reviewed manufacturer labels", note: "Whole-recipe total. Per-person nutrition is generated from target-based portions; do not divide automatically by recipe servings." },
  },
  {
    id: "sesame-tahini-ribbon-salad", name: "Cucumber & ribbon carrots with sesame-tahini dressing",
    proteinType: "none",
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
