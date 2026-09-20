export const NUTRIENT_KEYS = ["calories","protein","carbs","fat","fiber","saturatedFat","sugar","sodium"];

const number = (value, label) => {
  if (!Number.isFinite(value)) throw new Error(`${label} must be a finite number.`);
  return value;
};

export function scaleNutrition(nutrition, factor) {
  number(factor, "Scale factor");
  if (factor < 0) throw new Error("Scale factor cannot be negative.");
  return Object.fromEntries(NUTRIENT_KEYS.map((key) => {
    const value = nutrition?.[key];
    number(value, `Nutrition ${key}`);
    return [key, value * factor];
  }));
}

export function sumNutrition(items) {
  return items.reduce((total, item) => {
    NUTRIENT_KEYS.forEach((key) => {
      const value = item?.[key];
      number(value, `Nutrition ${key}`);
      total[key] += value;
    });
    return total;
  }, Object.fromEntries(NUTRIENT_KEYS.map((key) => [key, 0])));
}

export function calculateRecipePortion(recipe, componentScales = {}) {
  const components = recipe?.portionStrategy?.components;
  if (!Array.isArray(components) || !components.length) {
    throw new Error("Recipe is not portion-ready: portionStrategy.components is required.");
  }

  const calculated = components.map((component) => {
    const scale = componentScales[component.id];
    if (!Number.isFinite(scale) || scale < 0) {
      throw new Error(`Missing or invalid scale for component: ${component.id}`);
    }
    if (!component.nutrition) throw new Error(`Missing nutrition for component: ${component.id}`);

    return {
      id: component.id,
      role: component.role || "flavor-locked",
      scale,
      nutrition: scaleNutrition(component.nutrition, scale),
      ingredients: (component.ingredients || []).map((ingredient) => {
        if (!Number.isFinite(ingredient.amount)) throw new Error(`Ingredient amount must be quantified: ${ingredient.name || ingredient.id}`);
        return { ...ingredient, scaledAmount: ingredient.amount * scale };
      }),
    };
  });

  return {
    recipeId: recipe.id,
    components: calculated,
    nutrition: sumNutrition(calculated.map((component) => component.nutrition)),
    status: "calculated",
  };
}
