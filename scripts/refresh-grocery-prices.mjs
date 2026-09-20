import { groceryPriceRefreshPolicy, groceryStores } from "../src/grocery-pricing.js";

const stores = groceryPriceRefreshPolicy.stores;
const unknownStores = stores.filter((store) => !groceryStores[store]);

if (unknownStores.length) {
  throw new Error(`Unknown grocery stores in refresh policy: ${unknownStores.join(", ")}`);
}

console.log(`Weekly grocery price refresh: ${new Date().toISOString()}`);
console.log(`Trigger: ${groceryPriceRefreshPolicy.trigger}`);
console.log(`Stores: ${stores.map((store) => groceryStores[store].name).join(", ")}`);
console.log("Lookup adapters pending: workflow is scheduled and ready for verified store-source connectors.");
