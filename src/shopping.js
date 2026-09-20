import { getRecipe } from "./data.js";

export const formatAmount = (amount) => Number.isInteger(amount) ? String(amount) : String(Math.round(amount * 100) / 100);

export function consolidateShoppingList(week, pantry, extraRecipeIds = []) {
  const pantryByKey = new Map(pantry.map((item) => [item.key, item.status]));
  const plannedIds = week.days.flatMap((day) => day.recipeIds);
  const recipeIds = [...new Set([...plannedIds, ...extraRecipeIds])];
  const consolidated = new Map();

  recipeIds.flatMap((id) => getRecipe(id)?.ingredients ?? []).forEach((ingredient) => {
    if (ingredient.optional) return;
    const pantryStatus = pantryByKey.get(ingredient.key);
    if (ingredient.pantry && (pantryStatus === "Have" || pantryStatus === "Use First")) return;
    const listKey = `${ingredient.pickup === "wednesday" ? "wednesday" : "sunday"}:${ingredient.key}:${ingredient.unit}`;
    const existing = consolidated.get(listKey);
    if (existing) existing.amount += ingredient.amount;
    else consolidated.set(listKey, { ...ingredient, shop: ingredient.pickup === "wednesday" ? "wednesday" : "sunday" });
  });

  return [...consolidated.values()].sort((a, b) => a.category.localeCompare(b.category) || a.item.localeCompare(b.item));
}

export function groupShoppingList(items) {
  return items.reduce((shops, item) => {
    shops[item.shop] ??= {};
    shops[item.shop][item.category] ??= [];
    shops[item.shop][item.category].push(item);
    return shops;
  }, { sunday: {}, wednesday: {} });
}
