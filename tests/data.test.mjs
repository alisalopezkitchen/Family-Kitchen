import test from "node:test";
import assert from "node:assert/strict";
import { activeWeekId, getActiveWeek, getRecipe, initialPantry, recipes, weeks } from "../src/data.js";
import { consolidateShoppingList } from "../src/shopping.js";

test("active week and all recipe references are valid", () => {
  assert.ok(weeks.some((week) => week.id === activeWeekId));
  for (const day of getActiveWeek().days) for (const id of day.recipeIds) assert.ok(getRecipe(id), `Missing recipe: ${id}`);
});

test("recipe IDs are unique and records contain required fields", () => {
  assert.equal(new Set(recipes.map((recipe) => recipe.id)).size, recipes.length);
  for (const recipe of recipes) {
    for (const field of ["name", "description", "servings", "servingSize", "ingredients", "instructions", "nutrition", "storage", "tags", "portions"]) assert.ok(recipe[field], `${recipe.id} missing ${field}`);
  }
});

test("shopping list consolidates ingredients and filters pantry items marked Have", () => {
  const list = consolidateShoppingList(getActiveWeek(), initialPantry);
  assert.equal(list.filter((item) => item.key === "carrots" && item.shop === "sunday").length, 1);
  assert.equal(list.some((item) => item.key === "olive-oil"), false);
  assert.equal(list.some((item) => item.key === "tamari"), true, "Low pantry items should remain on the list");
  assert.equal(list.some((item) => item.pickup === "wednesday"), true);
});
