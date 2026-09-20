// Store discovery is deliberately provider-agnostic.
// A ZIP identifies the market; a discovery provider must return exact retailer
// locations before any price can be verified against that branch.

export const supportedRetailers = {
  ralphs: { name: "Ralphs", source: "official-store-locator", locatorUrl: "https://www.ralphs.com/stores/search" },
  sprouts: { name: "Sprouts", source: "official-store-locator", locatorUrl: "https://www.sprouts.com/store/" },
  "seafood-city": { name: "Seafood City", source: "official-store-locator", locatorUrl: "https://www.seafoodcity.com/store-locations/" },
};

export const normalizeDiscoveredStore = (retailerKey, store) => {
  if (!supportedRetailers[retailerKey]) return null;
  if (!store?.id || !store?.name || !store?.postalCode) return null;
  return {
    retailerKey,
    id: String(store.id),
    name: store.name,
    address: store.address || "",
    city: store.city || "",
    region: store.region || "",
    postalCode: String(store.postalCode),
    sourceUrl: store.sourceUrl || "",
  };
};

export const selectExactStore = (profile, store) => ({
  ...profile,
  shopping: {
    ...profile.shopping,
    exactStores: {
      ...(profile.shopping?.exactStores || {}),
      [store.retailerKey]: store,
    },
  },
});

export const exactStoreFor = (profile, retailerKey) => profile?.shopping?.exactStores?.[retailerKey] || null;

export const needsStoreDiscovery = (profile) =>
  /^\d{5}$/.test(profile?.postalCode || "") &&
  (profile.shopping?.preferredStores || []).some((key) => !exactStoreFor(profile, key));


export const storeDiscoveryRequest = (profile) => {
  const postalCode = String(profile?.postalCode || "");
  if (!/^\d{5}$/.test(postalCode)) return null;
  const preferred = profile.shopping?.preferredStores?.length
    ? profile.shopping.preferredStores
    : Object.keys(supportedRetailers);
  return {
    postalCode,
    retailers: preferred.filter((key) => supportedRetailers[key]),
    selectedStoreIds: Object.fromEntries(Object.entries(profile.shopping?.exactStores || {}).map(([key, store]) => [key, String(store.id)])),
  };
};

export const normalizeStoreDiscoveryResults = (request, results = {}) => {
  if (!request) return {};
  return Object.fromEntries(request.retailers.map((retailerKey) => [
    retailerKey,
    (results[retailerKey] || [])
      .map((store) => normalizeDiscoveredStore(retailerKey, store))
      .filter(Boolean)
      .filter((store) => store.postalCode === request.postalCode || store.distanceMiles !== undefined)
  ]));
};
