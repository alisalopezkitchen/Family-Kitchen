import { NUTRIENT_KEYS, sumNutrition } from "./portioning.js";

const finite = (value) => Number.isFinite(value);

export function evaluateNutrition(nutrition, targets) {
  if (!nutrition || NUTRIENT_KEYS.some((key) => !finite(nutrition[key]))) {
    return { status: "incomplete", reason: "All planned nutrition must be quantified before target validation." };
  }
  const metrics = {
    calories: { value: nutrition.calories, target: targets.calories, status: nutrition.calories > targets.calories ? "high" : "on-target" },
    protein: { value: nutrition.protein, min: targets.protein, max: targets.proteinUpper, status: nutrition.protein < targets.protein ? "low" : nutrition.protein > targets.proteinUpper ? "high" : "on-target" },
    fiber: { value: nutrition.fiber, min: targets.fiber, max: targets.fiberUpper, status: nutrition.fiber < targets.fiber ? "low" : nutrition.fiber > targets.fiberUpper ? "high" : "on-target" },
    saturatedFat: { value: nutrition.saturatedFat, max: targets.saturatedFatMax, status: nutrition.saturatedFat > targets.saturatedFatMax ? "high" : "on-target" },
  };
  return {
    status: Object.values(metrics).every((metric) => metric.status === "on-target") ? "on-target" : "needs-adjustment",
    metrics,
  };
}

export function evaluateDay(items, targets) {
  if (!Array.isArray(items) || !items.length) return { status: "incomplete", reason: "No quantified meals supplied." };
  const incomplete = items.find((item) => !item?.nutrition || NUTRIENT_KEYS.some((key) => !finite(item.nutrition[key])));
  if (incomplete) return { status: "incomplete", reason: "At least one planned component is not quantified.", itemId: incomplete.id || null };
  const nutrition = sumNutrition(items.map((item) => item.nutrition));
  return { nutrition, ...evaluateNutrition(nutrition, targets) };
}

export function evaluateWeek(days, targets) {
  if (!Array.isArray(days) || !days.length) return { status: "incomplete", reason: "No days supplied." };
  const evaluatedDays = days.map((day) => ({ id: day.id, ...evaluateDay(day.items, targets) }));
  if (evaluatedDays.some((day) => day.status === "incomplete")) {
    return { status: "incomplete", days: evaluatedDays, reason: "Every planned day must be quantified before weekly validation." };
  }
  const totals = sumNutrition(evaluatedDays.map((day) => day.nutrition));
  const average = Object.fromEntries(NUTRIENT_KEYS.map((key) => [key, totals[key] / evaluatedDays.length]));
  return { status: evaluateNutrition(average, targets).status, average, days: evaluatedDays, evaluation: evaluateNutrition(average, targets) };
}
