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
