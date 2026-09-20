import { calculateRecipePortion, NUTRIENT_KEYS, sumNutrition } from "./portioning.js";
import { evaluateNutrition } from "./nutrition-engine.js";

const finiteNutrition = (nutrition) => nutrition && NUTRIENT_KEYS.every((key) => Number.isFinite(nutrition[key]));

const targetPenalty = (nutrition, targets) => {
  const calorieGap = Math.abs(nutrition.calories - targets.calories) / Math.max(targets.calories, 1);
  const proteinGap = nutrition.protein < targets.protein ? (targets.protein - nutrition.protein) / targets.protein : 0;
  const fiberGap = nutrition.fiber < targets.fiber ? (targets.fiber - nutrition.fiber) / targets.fiber : 0;
  const saturatedFatOver = Math.max(0, nutrition.saturatedFat - targets.saturatedFatMax) / Math.max(targets.saturatedFatMax, 1);
  return calorieGap * 4 + proteinGap * 3 + fiberGap * 2 + saturatedFatOver * 5;
};

const scaleValues = ({ min = 0.5, max = 1.5, step = 0.05 } = {}) => {
  const values = [];
  for (let value = min; value <= max + 1e-9; value += step) values.push(Number(value.toFixed(4)));
  return values;
};

export function optimizeDayPortions({ recipes, fixedItems = [], targets, scaleRange }) {
  if (!Array.isArray(recipes) || !recipes.length) return { status: "incomplete", reason: "No portion-ready recipes supplied." };
  if (!targets) return { status: "incomplete", reason: "Nutrition targets are required." };
  if (fixedItems.some((item) => !finiteNutrition(item.nutrition))) return { status: "incomplete", reason: "A fixed meal or component is not quantified." };

  const adjustable = recipes.map((recipe) => {
    const components = recipe?.portionStrategy?.components;
    if (!Array.isArray(components) || !components.length) throw new Error(`Recipe is not portion-ready: ${recipe?.id || "unknown"}`);
    return { recipe, components };
  });

  const variables = [];
  adjustable.forEach(({ recipe, components }) => {
    const locked = components.filter((component) => (component.role || "flavor-locked") === "flavor-locked");
    const independent = components.filter((component) => (component.role || "flavor-locked") !== "flavor-locked");
    if (locked.length) variables.push({ key: `${recipe.id}:locked`, recipeId: recipe.id, componentIds: locked.map((component) => component.id) });
    independent.forEach((component) => variables.push({ key: `${recipe.id}:${component.id}`, recipeId: recipe.id, componentIds: [component.id] }));
  });

  if (variables.length > 6) return { status: "needs-simplification", reason: "Too many adjustable portion groups for bounded search; lock more meal components first." };

  const choices = scaleValues(scaleRange);
  let best = null;
  const walk = (index, selected) => {
    if (index < variables.length) {
      for (const scale of choices) walk(index + 1, { ...selected, [variables[index].key]: scale });
      return;
    }
    const portions = adjustable.map(({ recipe, components }) => {
      const scales = {};
      variables.filter((variable) => variable.recipeId === recipe.id).forEach((variable) => variable.componentIds.forEach((id) => { scales[id] = selected[variable.key]; }));
      return calculateRecipePortion(recipe, scales);
    });
    const nutrition = sumNutrition([...fixedItems.map((item) => item.nutrition), ...portions.map((portion) => portion.nutrition)]);
    const penalty = targetPenalty(nutrition, targets);
    if (!best || penalty < best.penalty) best = { penalty, nutrition, portions, scales: selected };
  };
  walk(0, {});

  return {
    status: "optimized",
    nutrition: best.nutrition,
    evaluation: evaluateNutrition(best.nutrition, targets),
    portions: best.portions,
    scales: best.scales,
    score: best.penalty,
    note: "Flavor-locked components share one scale. Genuine independent sides may use separate scales. Recipe selection is unchanged.",
  };
}
