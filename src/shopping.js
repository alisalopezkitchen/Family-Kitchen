import { getRecipe } from "./data.js";

export const formatAmount = (amount) => Number.isInteger(amount) ? String(amount) : String(Math.round(amount * 100) / 100);

const unitGroups = {
  volume: { tsp: 1, tbsp: 3, cup: 48 },
  weight: { oz: 1, lb: 16 },
};
function unitInfo(unit) {
  for (const [group, units] of Object.entries(unitGroups)) if (unit in units) return { group, factor: units[unit] };
  return null;
}
function normalizeIngredient(ingredient) {
  const info = unitInfo(ingredient.unit);
  if (!info) return { ...ingredient, normalizedAmount: ingredient.amount, normalizedUnit: ingredient.unit, unitGroup: ingredient.unit || "count" };
  return { ...ingredient, normalizedAmount: ingredient.amount * info.factor, normalizedUnit: info.group === "volume" ? "tsp" : "oz", unitGroup: info.group };
}
function displayQuantity(item) {
  if (item.shoppingOptions) return { amount: "", unit: "", displayAmount: item.shoppingOptions };
  if (item.unitGroup === "weight") {
    const oz = item.normalizedAmount;
    if (oz >= 16) {
      const lb = Math.floor(oz / 16), rem = Math.round((oz % 16) * 10) / 10;
      return { amount: oz, unit: "oz", displayAmount: rem ? `${lb} lb ${formatAmount(rem)} oz` : `${lb} lb` };
    }
    return { amount: oz, unit: "oz", displayAmount: `${formatAmount(oz)} oz` };
  }
  if (item.unitGroup === "volume") {
    const tsp = item.normalizedAmount;
    if (tsp >= 12 && tsp % 3 === 0) return { amount: tsp / 3, unit: "tbsp", displayAmount: `${formatAmount(tsp / 3)} tbsp` };
    if (tsp >= 3) return { amount: tsp / 3, unit: "tbsp", displayAmount: `${formatAmount(tsp / 3)} tbsp` };
    return { amount: tsp, unit: "tsp", displayAmount: `${formatAmount(tsp)} tsp` };
  }
  return { amount: item.normalizedAmount, unit: item.normalizedUnit, displayAmount: `${formatAmount(item.normalizedAmount)} ${item.normalizedUnit}`.trim() };
}

export function consolidateShoppingList(week, pantry, extraRecipeIds = []) {
  const pantryByKey = new Map(pantry.map((item) => [item.key, item.status]));
  const plannedIds = week.days.flatMap((day) => Object.values(day.meals).flat());
  const recipeIds = [...new Set([...plannedIds, ...extraRecipeIds])];
  const ingredients = recipeIds.flatMap((id) => getRecipe(id)?.ingredients ?? []);
  const standalone = week.treats ?? [];
  const ingredientByKey = new Map([...ingredients, ...standalone].map((ingredient) => [ingredient.key, ingredient]));
  const pantryBuyItems = pantry
    .filter((item) => item.status === "Buy")
    .filter((item) => !ingredientByKey.has(item.key))
    .map((item) => ({ key: item.key, item: item.name, amount: 1, unit: "item", category: "Pantry", pantryRequested: true }));
  const consolidated = new Map();

  [...ingredients, ...standalone, ...pantryBuyItems].forEach((ingredient) => {
    if (ingredient.optional) return;
    const pantryStatus = pantryByKey.get(ingredient.key);
    if (pantryStatus === "Have" || pantryStatus === "Use First") {
      if (ingredient.pantry) return;
    }
    if (pantryStatus === "Low" && ingredient.pantry !== true) return;
    const n = normalizeIngredient(ingredient);
    const shop = ingredient.pickup === "wednesday" ? "wednesday" : "sunday";
    const listKey = `${shop}:${ingredient.key}:${n.unitGroup}`;
    const existing = consolidated.get(listKey);
    if (existing) existing.normalizedAmount += n.normalizedAmount;
    else consolidated.set(listKey, { ...n, shop });
  });

  return [...consolidated.values()].map((item) => ({ ...item, ...displayQuantity(item) }))
    .sort((a, b) => a.category.localeCompare(b.category) || a.item.localeCompare(b.item));
}

export function groupShoppingList(items) {
  return items.reduce((shops, item) => {
    shops[item.shop] ??= {};
    shops[item.shop][item.category] ??= [];
    shops[item.shop][item.category].push(item);
    return shops;
  }, { sunday: {}, wednesday: {} });
}
