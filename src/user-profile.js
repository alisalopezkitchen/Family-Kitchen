// Portable user profile foundation.
// Recipes remain shared catalogue data; personal nutrition and shopping context
// belong to the user profile so Family Kitchen can eventually support many users.

export const defaultUserProfile = {
  id: "local-user",
  displayName: "My Kitchen",
  postalCode: "",
  nutritionTargets: {
    calories: 1750,
    protein: 125,
    proteinUpper: 130,
    fiber: 25,
    fiberUpper: 30,
    saturatedFatMax: 15,
  },
  shopping: {
    market: null,
    preferredStores: ["ralphs", "sprouts", "seafood-city"],
    exactStores: {},
    radiusMiles: 10,
    optimizationMode: "fewest-trips",
    meaningfulSavings: 5,
    maxTrips: 2,
  },
  preferences: {
    recipeStates: {},
    dietaryNotes: [],
  },
};

export const USER_PROFILE_STORAGE_KEY = "fk-user-profile";

export const loadUserProfile = (storage = globalThis.localStorage) => {
  if (!storage) return structuredClone(defaultUserProfile);
  try {
    const saved = JSON.parse(storage.getItem(USER_PROFILE_STORAGE_KEY) || "null");
    return {
      ...structuredClone(defaultUserProfile),
      ...(saved || {}),
      nutritionTargets: { ...defaultUserProfile.nutritionTargets, ...(saved?.nutritionTargets || {}) },
      shopping: { ...defaultUserProfile.shopping, ...(saved?.shopping || {}) },
      preferences: { ...defaultUserProfile.preferences, ...(saved?.preferences || {}) },
    };
  } catch {
    return structuredClone(defaultUserProfile);
  }
};

export const saveUserProfile = (profile, storage = globalThis.localStorage) => {
  storage?.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  return profile;
};

export const profileNeedsLocationSetup = (profile) => !/^\d{5}$/.test(profile?.postalCode || "");
