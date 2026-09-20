// Local store selection controls which catalog is allowed to verify prices.
// Keep store IDs configurable: exact branches can be selected without changing
// the grocery pricing engine.

export const localStoreConfiguration = {
  market: "San Diego, CA",
  stores: {
    ralphs: {
      retailer: "Ralphs",
      locationStatus: "needs-exact-store",
      storeId: null,
      label: "Select local Ralphs",
    },
    sprouts: {
      retailer: "Sprouts",
      locationStatus: "needs-exact-store",
      storeId: null,
      label: "Select local Sprouts",
    },
    "seafood-city": {
      retailer: "Seafood City",
      locationStatus: "needs-exact-store",
      storeId: null,
      label: "Select National City or Mira Mesa",
      candidates: ["National City", "Mira Mesa"],
    },
  },
};

export const configuredStore = (storeKey) => localStoreConfiguration.stores[storeKey] || null;

export const canVerifyLocalPrice = (storeKey) => {
  const store = configuredStore(storeKey);
  return Boolean(store?.storeId && store.locationStatus === "configured");
};
