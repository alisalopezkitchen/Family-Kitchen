// Permanent preferred pantry products used when standardizing recipes.
// Nutrition facts are intentionally not stored here until matched to a verified
// manufacturer label or FoodData Central record.

export const pantryProductRegistry = {
  mayonnaise: { brand: "Primal Kitchen", product: "Avocado Oil Mayo", stores: ["Ralphs", "Sprouts"], matchStatus: "needs-label-match" },
  "fish-sauce": { brand: "Red Boat", product: "40°N Fish Sauce", stores: ["Ralphs", "Seafood City"], matchStatus: "needs-label-match" },
  tamari: { brand: "San-J", product: "Tamari", stores: ["Ralphs", "Sprouts"], matchStatus: "needs-label-match" },
  "sesame-oil": { brand: "Kadoya", product: "Pure Sesame Oil", recipeUse: "toasted sesame oil", stores: ["Ralphs", "Seafood City"], matchStatus: "needs-label-match" },
  "rice-vinegar": { brand: "Marukan", product: "Genuine Brewed Rice Vinegar", variety: "unseasoned", stores: ["Ralphs", "Seafood City"], matchStatus: "needs-label-match" },
  tahini: { brand: "Soom", product: "Tahini", fallback: "100% sesame tahini", stores: ["Sprouts"], matchStatus: "needs-label-match" },
  sriracha: { brand: "Huy Fong", product: "Sriracha", stores: ["Ralphs", "Seafood City"], matchStatus: "needs-label-match" },
  "garlic-oil": { brand: "FODY", product: "Garlic-Infused Extra Virgin Olive Oil", stores: ["Sprouts"], matchStatus: "needs-label-match" },
  "olive-oil": { brand: "California Olive Ranch", product: "Extra Virgin Olive Oil", stores: ["Ralphs", "Sprouts"], matchStatus: "needs-label-match" },
  "greek-yogurt": { brand: "FAGE", product: "Total 2% Plain", fatPercent: 2, stores: ["Ralphs", "Sprouts"], matchStatus: "needs-label-match" },
  feta: { brand: "Dodoni", product: "Feta in Brine", fallback: "traditional feta in brine", stores: ["Sprouts", "Ralphs"], matchStatus: "needs-label-match" },
  panko: { brand: "Kikkoman", product: "Panko", variety: "plain", stores: ["Ralphs", "Seafood City"], matchStatus: "needs-label-match" },
  honey: { product: "100% pure/raw honey", stores: ["Ralphs", "Seafood City", "Sprouts"], nutritionSource: "generic-USDA-allowed" },
  "maple-syrup": { product: "100% pure maple syrup", stores: ["Ralphs", "Sprouts"], nutritionSource: "generic-USDA-allowed" },
  "brown-sugar": { product: "brown sugar", stores: ["Ralphs", "Seafood City", "Sprouts"], nutritionSource: "generic-USDA-allowed" },
  hoisin: { brand: "Lee Kum Kee", product: "Hoisin Sauce", stores: ["Seafood City", "Ralphs"], matchStatus: "needs-label-match" },
  "oyster-sauce": { brand: "Lee Kum Kee", product: "Premium Oyster Sauce", stores: ["Seafood City", "Ralphs"], matchStatus: "needs-label-match" },
  "coconut-milk": { brand: "Thai Kitchen", product: "Unsweetened Coconut Milk", variety: "full-fat", stores: ["Ralphs", "Sprouts"], matchStatus: "needs-label-match" },
  "chili-crisp": { product: null, optional: true, stores: ["Seafood City", "Ralphs"], matchStatus: "no-permanent-default" }
};

export function pantryProduct(key) {
  return pantryProductRegistry[key] || null;
}

export function preferredIngredientName(key, fallbackName = key) {
  const preferred = pantryProduct(key);
  if (!preferred) return fallbackName;
  return [preferred.brand, preferred.product].filter(Boolean).join(" ") || fallbackName;
}
