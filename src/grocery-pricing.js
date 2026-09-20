// Grocery price comparison model.
// Price observations are intentionally separate from recipe nutrition.
// A future updater can populate these records from verified store listings.

export const groceryStores = {
  ralphs: { name: "Ralphs", pricePriority: true },
  sprouts: { name: "Sprouts", pricePriority: true },
  "seafood-city": { name: "Seafood City", pricePriority: true },
};

export const groceryPriceObservations = [];

const comparableUnitPrice = (observation) => {
  const price = Number(observation.price);
  const quantity = Number(observation.packageQuantity);
  if (!Number.isFinite(price) || !Number.isFinite(quantity) || quantity <= 0) return null;
  return price / quantity;
};

export const bestVerifiedGroceryPrice = (ingredientKey, observations = groceryPriceObservations) => {
  const candidates = observations
    .filter((item) => item.ingredientKey === ingredientKey && item.verified === true)
    .map((item) => ({ ...item, unitPrice: comparableUnitPrice(item) }))
    .filter((item) => item.unitPrice !== null);

  if (!candidates.length) return { status: "no-verified-price", ingredientKey };

  // Compare only like-for-like package units. We do not pretend ounces, counts,
  // pounds, or fluid ounces are interchangeable without a verified conversion.
  const unitGroups = Object.groupBy
    ? Object.groupBy(candidates, (item) => item.packageUnit)
    : candidates.reduce((groups, item) => ((groups[item.packageUnit] ||= []).push(item), groups), {});

  const winners = Object.entries(unitGroups).map(([packageUnit, items]) =>
    items.sort((a, b) => a.unitPrice - b.unitPrice || new Date(b.checkedAt) - new Date(a.checkedAt))[0]
  );

  return { status: "verified", ingredientKey, winners };
};

export const groceryPriceObservationShape = {
  ingredientKey: "canonical recipe/shopping ingredient key",
  productName: "exact listed product",
  store: "ralphs | sprouts | seafood-city",
  price: "listed shelf/cart price",
  packageQuantity: "numeric package size",
  packageUnit: "oz | fl-oz | lb | count | each",
  salePrice: "optional",
  loyaltyRequired: "boolean",
  verified: "true only after exact listing/product match",
  checkedAt: "ISO timestamp",
  sourceUrl: "store listing URL when available",
};
