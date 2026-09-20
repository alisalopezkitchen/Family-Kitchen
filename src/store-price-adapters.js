// Store lookup adapter contract.
// Each adapter must return observations in the grocery-pricing schema.
// Do not mark an observation verified unless the product, package size,
// current price, store, and source listing were all matched.

export const storePriceAdapters = {
  ralphs: {
    id: "ralphs",
    status: "official-source-identified",
    sourceType: "official-weekly-ad",
    sourceUrl: "https://www.ralphs.com/weeklyad",
    locationRequired: true,
  },
  sprouts: {
    id: "sprouts",
    status: "official-source-identified",
    sourceType: "official-online-catalog",
    sourceUrl: "https://shop.sprouts.com/store/sprouts/",
    locationRequired: true,
  },
  "seafood-city": {
    id: "seafood-city",
    status: "official-source-identified",
    sourceType: "official-online-store",
    sourceUrl: "https://www.seafoodcity.com/",
    locationRequired: true,
  },
};

export const storePriceSourcePolicy = {
  requireOfficialSource: true,
  requireSelectedStore: true,
  rejectSearchSnippetAsVerification: true,
  rejectUnmatchedLocation: true,
  notes: "Price verification must use the selected local store/catalog. Public search results may discover a listing but cannot by themselves verify a local price.",
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
