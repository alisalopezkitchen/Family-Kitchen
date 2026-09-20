// Optimizes a priced shopping list across exact local stores.
// Prices must already be fresh/verified; this module never invents a price.

const validOffers = (item) => (item.offers || []).filter((offer) =>
  Number.isFinite(offer.totalPrice) && offer.totalPrice >= 0 && offer.storeId
);

const combinations = (values) => {
  const result = [];
  const n = values.length;
  for (let mask = 1; mask < (1 << n); mask += 1) {
    const selected = values.filter((_, index) => mask & (1 << index));
    result.push(selected);
  }
  return result;
};

const planForStores = (items, storeIds) => {
  const assignments = [];
  let total = 0;
  for (const item of items) {
    const offers = validOffers(item).filter((offer) => storeIds.includes(offer.storeId));
    if (!offers.length) return null;
    const best = offers.reduce((a, b) => a.totalPrice <= b.totalPrice ? a : b);
    assignments.push({ itemKey: item.key, item: item.item, offer: best });
    total += best.totalPrice;
  }
  return { storeIds, tripCount: storeIds.length, total: Math.round(total * 100) / 100, assignments };
};

export function optimizeShoppingTrips(items, { mode = "fewest-trips", meaningfulSavings = 5, maxTrips = Infinity } = {}) {
  const priced = items.filter((item) => validOffers(item).length);
  const unpriced = items.filter((item) => !validOffers(item).length);
  const storeIds = [...new Set(priced.flatMap((item) => validOffers(item).map((offer) => offer.storeId)))];
  if (!priced.length || !storeIds.length) return { mode, plan: null, alternatives: [], unpriced };

  const tripLimit = Number.isFinite(Number(maxTrips)) && Number(maxTrips) > 0 ? Number(maxTrips) : Infinity;
  const plans = combinations(storeIds).filter((ids) => ids.length <= tripLimit).map((ids) => planForStores(priced, ids)).filter(Boolean);
  if (!plans.length) return { mode, plan: null, alternatives: [], unpriced, reason: "No priced plan fits the selected trip limit." };

  const cheapest = [...plans].sort((a, b) => a.total - b.total || a.tripCount - b.tripCount)[0];
  const fewest = [...plans].sort((a, b) => a.tripCount - b.tripCount || a.total - b.total)[0];
  let plan = fewest;

  if (mode === "lowest-price") plan = cheapest;
  if (mode === "balanced") {
    plan = [...plans]
      .filter((candidate) => candidate.total <= cheapest.total + meaningfulSavings)
      .sort((a, b) => a.tripCount - b.tripCount || a.total - b.total)[0] || cheapest;
  }

  const alternatives = [fewest, cheapest]
    .filter((candidate, index, all) => all.findIndex((x) => x.tripCount === candidate.tripCount && x.total === candidate.total) === index);

  return {
    mode,
    plan,
    alternatives,
    unpriced,
    savingsVsFewestTrips: Math.round((fewest.total - plan.total) * 100) / 100,
  };
}
