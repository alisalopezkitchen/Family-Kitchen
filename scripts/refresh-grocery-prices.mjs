import { groceryPriceRefreshPolicy, groceryStores } from "../src/grocery-pricing.js";
import { storePriceAdapters } from "../src/store-price-adapters.js";

const stores = groceryPriceRefreshPolicy.stores;
const unknownStores = stores.filter((store) => !groceryStores[store]);

if (unknownStores.length) {
  throw new Error(`Unknown grocery stores in refresh policy: ${unknownStores.join(", ")}`);
}

console.log(`Weekly grocery price refresh: ${new Date().toISOString()}`);
console.log(`Trigger: ${groceryPriceRefreshPolicy.trigger}`);
console.log(`Stores: ${stores.map((store) => groceryStores[store].name).join(", ")}`);
for (const store of stores) {
  const adapter = storePriceAdapters[store];
  console.log(`${groceryStores[store].name}: ${adapter?.status || "missing-adapter"}`);
}
console.log("Store adapter contract ready. Source-specific retrieval remains blocked until a reliable store listing/feed is connected.");
