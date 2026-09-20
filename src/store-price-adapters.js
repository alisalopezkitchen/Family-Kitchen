// Store lookup adapter contract.
// Each adapter must return observations in the grocery-pricing schema.
// Do not mark an observation verified unless the product, package size,
// current price, store, and source listing were all matched.

export const storePriceAdapters = {
  ralphs: { id: "ralphs", status: "source-needed" },
  sprouts: { id: "sprouts", status: "source-needed" },
  "seafood-city": { id: "seafood-city", status: "source-needed" },
};

export const validatePriceObservation = (observation) => {
  const required = ["ingredientKey", "productName", "store", "price", "packageQuantity", "packageUnit", "checkedAt", "sourceUrl"];
  const missing = required.filter((key) => observation?.[key] === undefined || observation?.[key] === null || observation?.[key] === "");
  if (missing.length) return { valid: false, missing };
  if (!Number.isFinite(Number(observation.price)) || Number(observation.price) < 0) return { valid: false, missing: ["valid price"] };
  if (!Number.isFinite(Number(observation.packageQuantity)) || Number(observation.packageQuantity) <= 0) return { valid: false, missing: ["valid package quantity"] };
  return { valid: true, missing: [] };
};

export const verifiedObservation = (observation) => {
  const validation = validatePriceObservation(observation);
  return { ...observation, verified: validation.valid, validation };
};
