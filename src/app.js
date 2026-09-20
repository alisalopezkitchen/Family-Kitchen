import { getActiveWeek, getPastWeeks, getRecipe, initialPantry, initialPreparedSauces, preparedSauceStatuses, nutritionSource, nutritionTargets, pantryStatuses, recipes } from "./data.js";
import { consolidateShoppingList, formatAmount, groupShoppingList } from "./shopping.js";

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".primary-nav");
const store = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
};
let pantry = store.get("fk-pantry", initialPantry);
let extras = store.get("fk-shopping-extras", []);
let checked = store.get("fk-shopping-checked", []);
let mealMoves = store.get("fk-meal-moves", []);
let pantryFilter = "all";
let shoppingStoreFilter = "all";
let recipeFilter = "all";
let recipePreferences = store.get("fk-recipe-preferences", { alisa: {}, mom: {} });
function recipePreference(recipeId, person = "alisa") { return recipePreferences[person]?.[recipeId] || "want-to-try"; }
function setRecipePreference(recipeId, status, person = "alisa") {
  recipePreferences = { ...recipePreferences, [person]: { ...(recipePreferences[person] || {}), [recipeId]: status } };
  store.set("fk-recipe-preferences", recipePreferences);
}
let preparedSauces = store.get("fk-prepared-sauces", initialPreparedSauces).map((item) => ({ ...item, madeOn: item.madeOn || "" }));

const icons = {
  arrow: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>`,
  leaf: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 4c-8 0-14 4-14 10 0 2 1 4 3 5 1-7 5-10 9-12-4 3-7 7-8 13 7 0 11-6 10-16Z"/></svg>`,
  cart: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 4h2l2.5 11h10l2-8H6M9 20h.01M17 20h.01"/></svg>`,
  clock: `<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
};

function escapeHtml(value = "") { return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]); }
function showToast(message) { toast.textContent = message; toast.classList.add("show"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400); }
function recipeLink(recipe, compact = false) { return `<a class="recipe-link${compact ? " compact" : ""}" href="#/recipes/${recipe.id}"><span>${escapeHtml(recipe.name)}</span>${icons.arrow}</a>`; }
function pageHeader(kicker, title, intro) { return `<header class="page-heading"><p class="eyebrow">${kicker}</p><h1>${title}</h1>${intro ? `<p class="lede">${intro}</p>` : ""}</header>`; }
function activeWeek() { return getActiveWeek(); }
function getUseFirst() { return pantry.filter((item) => item.status === "Use First"); }

function homeView() {
  const week = activeWeek();
  const dinnerDays = week.days.filter((day) => day.meals.dinner.length);
  return `<section class="home-hero">
    <div class="hero-copy"><p class="eyebrow">${week.label} · ${week.dateRange}</p><h1>Good food,<br><em>thoughtfully planned.</em></h1><p>A calm home base for this week’s meals, prep, and shopping—so dinner feels easier.</p><div class="hero-actions"><a class="button primary" href="#/week">See this week ${icons.arrow}</a><a class="button text" href="#/shopping">Open shopping list</a></div></div>
    <aside class="tonight-card"><span class="card-label">Sunday table</span><p class="tiny-label">First up this week</p><h2>${getRecipe(dinnerDays[0].meals.dinner[0]).name}</h2><p>with basmati rice, a crisp herb salad, and lemon-dill sauce</p><div class="tonight-meta"><span>${icons.clock} Sunday dinner</span><a href="#/week">View plan ${icons.arrow}</a></div></aside>
  </section>
  <section class="dashboard section-shell"><div class="section-title"><div><p class="eyebrow">At a glance</p><h2>Your week in the kitchen</h2></div><p>${dinnerDays.length} dinners planned · ${week.days.length - dinnerDays.length} open evenings</p></div>
    <div class="dashboard-grid">
      <article class="panel plan-preview"><div class="panel-heading"><span class="icon-disc">${icons.leaf}</span><div><p class="tiny-label">Meals planned</p><h3>${dinnerDays.length} dinners, plenty of room</h3></div></div>${mealDays.map((day) => `<div class="mini-day"><strong>${day.day.slice(0, 3)}</strong><span>${escapeHtml(getRecipe(day.recipeIds[0]).name)}</span></div>`).join("")}<a class="panel-link" href="#/week">Full weekly plan ${icons.arrow}</a></article>
      <article class="panel prep-card"><div class="panel-heading"><span class="number-disc">01</span><div><p class="tiny-label">Sunday prep</p><h3>Set up the week</h3></div></div><ul class="clean-list">${week.sundayPrep.map((item) => `<li>${item}</li>`).join("")}</ul><a class="panel-link" href="#/week">Prep details ${icons.arrow}</a></article>
      <article class="panel pickup-card"><div class="panel-heading"><span class="number-disc">02</span><div><p class="tiny-label">Wednesday pickup</p><h3>Keep it fresh</h3></div></div><ul class="clean-list">${week.wednesdayPickup.map((item) => `<li>${item}</li>`).join("")}</ul><a class="panel-link" href="#/shopping">See pickup list ${icons.arrow}</a></article>
      <article class="panel pantry-card"><div class="panel-heading"><span class="icon-disc">${icons.leaf}</span><div><p class="tiny-label">Use first</p><h3>From the pantry</h3></div></div>${getUseFirst().map((item) => `<div class="use-first"><span>${item.name}</span><span class="status use-first-status">Use First</span></div>`).join("") || "<p>Nothing needs using first.</p>"}<a class="panel-link" href="#/pantry">Open pantry ${icons.arrow}</a></article>
    </div>
  </section>
  <section class="section-shell recipe-strip"><div class="section-title"><div><p class="eyebrow">Quick links</p><h2>Recipes for this week</h2></div><a href="#/recipes">Browse all</a></div><div class="quick-recipe-grid">${recipes.slice(0, 4).map((r, i) => `<a class="quick-recipe tone-${i + 1}" href="#/recipes/${r.id}"><span class="recipe-number">0${i + 1}</span><div><span class="tag">${r.tags[0]}</span><h3>${r.name}</h3><p>${r.prepTime} prep · ${r.servings} servings</p></div>${icons.arrow}</a>`).join("")}</div></section>`;
}

function mealLabel(entry) { return typeof entry === "string" ? getRecipe(entry)?.name : entry?.label; }
function adjustedDays(week) {
  const days = structuredClone(week.days);
  for (const move of mealMoves) {
    const fromDay = days.findIndex((d) => d.day === move.day);
    if (fromDay < 0) continue;
    const source = days[fromDay].meals[move.meal]?.[move.index];
    if (!source) continue;
    days[fromDay].meals[move.meal].splice(move.index, 1);
    let placed = false;
    for (let di = fromDay + 1; di < days.length && !placed; di++) {
      for (const slot of ["breakfast","lunch","dinner"]) {
        const target = days[di].meals[slot];
        if (!target.length || target.every((x) => typeof x !== "string" && x.open)) {
          days[di].meals[slot] = [{ label: mealLabel(source), rollover: true }];
          placed = true; break;
        }
      }
    }
    if (!placed) days.push({ day: "Next Sunday", meals: { breakfast: [{ label: mealLabel(source), rollover: true }], lunch: [], dinner: [], snack: [] }, note: "Rolled forward to use ingredients already purchased." });
  }
  return days;
}

function nutritionTargetStrip() { return `<div class="nutrition-source-note"><strong>Nutrition source:</strong> ${nutritionSource.primary} · <strong>Tracking check:</strong> ${nutritionSource.tracking}</div><div class="nutrition-target-strip"><div><span>Daily target</span><strong>~${nutritionTargets.calories.toLocaleString()} kcal</strong></div><div><span>Protein</span><strong>${nutritionTargets.protein}–${nutritionTargets.proteinUpper} g</strong></div><div><span>Fiber</span><strong>${nutritionTargets.fiber}–${nutritionTargets.fiberUpper} g</strong></div><div><span>Sat. fat</span><strong>≤ ${nutritionTargets.saturatedFatMax} g</strong></div><p>These are the targets the nutrition engine validates against as recipes are quantified. Exact recipe values require quantified ingredients + servings; MyFitnessPal is used as a reconciliation check.</p></div>`; }

function numericNutrition(entry) {
  const n = typeof entry === "string" ? getRecipe(entry)?.nutrition : entry?.nutrition;
  return n && ["calories","protein","fiber","saturatedFat"].every((key) => typeof n[key] === "number") ? n : null;
}
function dayNutrition(day) {
  const entries = ["breakfast","lunch","dinner","snack"].flatMap((meal) => day.meals[meal] || []);
  const known = entries.map(numericNutrition).filter(Boolean);
  const totals = known.reduce((sum,n) => ({ calories:sum.calories+n.calories, protein:sum.protein+n.protein, fiber:sum.fiber+n.fiber, saturatedFat:sum.saturatedFat+n.saturatedFat }), {calories:0,protein:0,fiber:0,saturatedFat:0});
  return { totals, complete: known.length === entries.filter((e)=>!(typeof e !== "string" && e.open)).length, known:known.length };
}
function metricFit(value, metric) {
  if (metric === "calories") return value >= nutritionTargets.calories * .9 && value <= nutritionTargets.calories * 1.1 ? "On target" : value < nutritionTargets.calories * .9 ? "Low" : "High";
  if (metric === "protein") return value >= nutritionTargets.protein && value <= nutritionTargets.proteinUpper + 10 ? "On target" : value < nutritionTargets.protein ? "Low" : "High";
  if (metric === "fiber") return value >= nutritionTargets.fiber ? "On target" : "Low";
  return value <= nutritionTargets.saturatedFatMax ? "On target" : "High";
}
function dayNutritionTable(day) {
  const {totals,complete}=dayNutrition(day);
  if (!complete) return `<div class="day-nutrition pending"><span>Daily nutrition</span><strong>Pending quantified recipes</strong><span>Totals publish only when every planned component has verified nutrition.</span></div>`;
  const cells=[["Calories",Math.round(totals.calories),"calories","kcal"],["Protein",Math.round(totals.protein),"protein","g"],["Fiber",Math.round(totals.fiber),"fiber","g"],["Sat. fat",Math.round(totals.saturatedFat),"saturatedFat","g"]];
  return `<div class="day-nutrition ready"><div class="nutrition-row nutrition-head"><span>Daily total</span>${cells.map(c=>`<span>${c[0]}</span>`).join("")}</div><div class="nutrition-row"><strong>Alisa</strong>${cells.map(c=>`<span><b>${c[1]} ${c[3]}</b><small class="fit ${metricFit(c[1],c[2]).toLowerCase().replace(" ","-")}">${metricFit(c[1],c[2])}</small></span>`).join("")}</div></div>`;
}
function sundayPrepItems(week) {
  const sauceNames = new Map(preparedSauces.map((s) => [s.recipeId, s]));
  const plannedSauceIds = new Set(week.days.flatMap((day) => Object.values(day.meals).flat()).filter((entry) => typeof entry === "string" && sauceNames.has(entry)));
  const prep = week.sundayPrep.map((item) => {
    if (/lemon[-–— ]dill sauce/i.test(item)) {
      const sauce = preparedSauces.find((s) => s.recipeId === "mediterranean-lemon-dill-sauce");
      if (sauce?.status === "In Fridge") return "Use prepared lemon-dill sauce from fridge";
    }
    return item;
  });
  const today = new Date();
  const urgent = preparedSauces
    .filter((s) => s.status === "In Fridge" && s.madeOn)
    .map((s) => ({ ...s, useBy: new Date(new Date(`${s.madeOn}T00:00:00`).getTime() + s.storageDays * 86400000) }))
    .filter((s) => s.useBy >= new Date(today.getFullYear(), today.getMonth(), today.getDate()) && (s.useBy - today) / 86400000 <= 2)
    .sort((a,b) => a.useBy - b.useBy);
  urgent.forEach((s) => {
    const label = `Use first: ${s.name} by ${s.useBy.toLocaleDateString("en-US", { month:"short", day:"numeric" })}`;
    if (!prep.includes(label)) prep.unshift(label);
  });
  return prep;
}

function dayPreparedSauceNote(day) {
  const ids = Object.values(day.meals).flat().filter((entry) => typeof entry === "string");
  const notes = ids.map((id) => preparedSauces.find((s) => s.recipeId === id))
    .filter((s) => s?.status === "In Fridge" && s.recipeId !== "mediterranean-lemon-dill-sauce")
    .map((s) => `Use prepared ${s.name} from fridge.`);
  return [...new Set(notes)];
}

function prepView() {
  const week = activeWeek();
  const sundayTasks = [
    { group: "Protein", task: "Bake chicken-feta meatballs", quantity: "___ meatballs · ___ lb chicken", recipes: ["greek-chicken-feta-meatballs"] },
    { group: "Grain", task: "Cook basmati rice", quantity: "___ cups dry → ___ cups cooked", recipes: ["greek-chicken-feta-meatballs"] },
    { group: "Vegetables", task: "Wash and prep sturdy cucumber, carrots and herbs", quantity: "___ cucumbers · ___ carrots · ___ bunches herbs", recipes: ["cucumber-carrot-herb-salad", "sesame-tahini-ribbon-salad", "vietnamese-chicken-cabbage-salad"] },
    { group: "Sauce", task: "Check Mediterranean lemon-dill sauce", helper: "Use the fridge batch before making more", quantity: "___ tablespoons / ___ batch", recipes: ["mediterranean-lemon-dill-sauce"] }
  ];
  const wednesdayTasks = [
    { group: "Fresh protein", task: "Pick up sushi-grade ahi and salmon", quantity: "___ oz ahi · ___ oz salmon", recipes: ["sushi-style-rice-bowl", "brown-sugar-mayo-salmon"] },
    { group: "Produce", task: "Refresh avocado, sprouts and cucumbers", quantity: "___ avocado · ___ pack sprouts · ___ cucumbers", recipes: ["sushi-style-rice-bowl", "use-it-up-bowl"] },
    { group: "Flavor", task: "Refresh ginger and any herbs running low", quantity: "___ ginger · ___ bunches herbs", recipes: ["japanese-ginger-sesame-sauce"] },
    { group: "Inventory", task: "Check prepared sauces and use-by dates before making another batch", quantity: "Use existing fridge amounts first", recipes: ["japanese-ginger-sesame-sauce"] }
  ];
  const taskList = (tasks) => `<div class="prep-task-list">${tasks.map((item) => `<div class="prep-task"><p class="tiny-label">${item.group}</p><h3>${item.task}</h3>${item.helper ? `<p class="prep-task-helper">${item.helper}</p>` : ""}<p><strong>Quantity:</strong> ${item.quantity}</p><p><strong>Recipes:</strong> ${item.recipes.map((id) => recipeLink(getRecipe(id), true)).join("")}</p></div>`).join("")}</div>`;
  return `<section class="section-shell page">${pageHeader(`${week.label} · ${week.dateRange}`, "Prep", "Prep only what has a job this week. Each task shows which meals it supports so leftovers and fresh ingredients are intentional.")}
    <div id="sunday-prep" class="prep-session"><div class="panel-heading"><span class="number-disc">01</span><div><p class="tiny-label">Sunday prep</p><h2>Set up Sunday through Tuesday</h2></div></div>${taskList(sundayTasks)}</div>
    <div id="wednesday-refresh" class="prep-session"><div class="panel-heading"><span class="number-disc">02</span><div><p class="tiny-label">Wednesday refresh</p><h2>Set up Thursday through Saturday</h2></div></div>${taskList(wednesdayTasks)}</div>
  </section>`;
}

function weekView() {
  const week = activeWeek();
  const displayDays = adjustedDays(week);
  return `<section class="section-shell page">${pageHeader(`${week.label} · ${week.dateRange}`, "This week", "A flexible five-dinner rhythm with two intentional openings for life outside the kitchen.")}${nutritionTargetStrip()}
    <div class="week-layout"><div class="day-list">${displayDays.map((day) => `<article class="day-card"><div class="day-name"><span>${day.day.slice(0, 3)}</span><h2>${day.day}</h2></div><div class="day-content">${day.theme ? `<p class="tiny-label">${day.theme}</p>` : ""}${["breakfast","lunch","dinner","snack"].map((meal) => `<div class="meal-slot"><p class="tiny-label">${meal}</p>${day.meals[meal].length ? day.meals[meal].map((entry) => typeof entry === "string" ? `<div class="meal-line">${recipeLink(getRecipe(entry))}${meal === "breakfast" || meal === "lunch" || meal === "dinner" ? `<button class="move-meal" data-move-meal data-day="${day.day}" data-meal="${meal}" data-index="${day.meals[meal].indexOf(entry)}">Skipped? Move forward</button>` : ""}</div>` : `<div class="meal-line"><p class="meal-text${entry.leftover ? " leftover" : ""}${entry.open ? " open-meal" : ""}${entry.treat ? " treat-meal" : ""}">${entry.leftover ? '<span class="meal-badge">Leftover</span>' : entry.treat ? '<span class="meal-badge treat">Treat</span>' : entry.rollover ? '<span class="meal-badge">Moved forward</span>' : ""}${escapeHtml(entry.label)}</p>${!entry.open && !entry.rollover && ["breakfast","lunch","dinner"].includes(meal) ? `<button class="move-meal" data-move-meal data-day="${day.day}" data-meal="${meal}" data-index="${day.meals[meal].indexOf(entry)}">Skipped? Move forward</button>` : ""}</div>`).join("") : `<p class="day-note">Open / flexible</p>`}</div>`).join("")}${day.note ? `<p class="day-note">${day.note}</p>` : ""}${dayPreparedSauceNote(day).map((note) => `<p class="day-note"><strong>Prepared:</strong> ${note}</p>`).join("")}${dayNutritionTable(day)}</div></article>`).join("")}</div>
    <aside class="week-sidebar"><article class="note-card"><a class="prep-card-link" href="#/prep/sunday-prep"><span class="number-disc">01</span><p class="tiny-label">Sunday prep →</p><h3>A little now, easier later</h3></a><ul class="clean-list">${sundayPrepItems(week).map((item) => `<li>${item}</li>`).join("")}</ul></article><article class="note-card green"><a class="prep-card-link" href="#/prep/wednesday-refresh"><span class="number-disc">02</span><p class="tiny-label">Wednesday refresh →</p><h3>Fresh things, small trip</h3></a><ul class="clean-list">${week.wednesdayPickup.map((item) => `<li>${item}</li>`).join("")}</ul></article></aside></div></section>`;
}

function pastWeeksView() {
  const past = getPastWeeks();
  return `<section class="section-shell page">${pageHeader("Your kitchen history", "Past weeks", "Previous meal plans stay here for reference instead of disappearing when a new week begins.")}
    <div class="archive-grid">${past.length ? past.map((week) => `<article class="archive-card"><p class="eyebrow">${escapeHtml(week.label)}</p><h2>${escapeHtml(week.dateRange)}</h2><p>${week.days.length} days · ${week.days.reduce((n,d)=>n+d.meals.dinner.filter(x=>!(typeof x !== "string" && x.open)).length,0)} planned dinner components</p></article>`).join("") : '<div class="empty-progress"><h2>No archived weeks yet.</h2><p>When the next dated week becomes current, this week will move here automatically.</p></div>'}</div>
  </section>`;
}

function recipesView() {
  const visible = recipes.filter((recipe) => recipeFilter === "all" || recipePreference(recipe.id) === recipeFilter);
  const filters = [
    ["all", "All"],
    ["favorite", "Favorites"],
    ["want-to-try", "Want to Try"],
    ["not-for-me", "Not for Me"],
  ];
  return `<section class="section-shell page">${pageHeader("The recipe box", "Recipes & preferences", "Heart what you love, keep new ideas in Want to Try, and mark recipes Not for Me without deleting them.")}
    <div class="filter-row" role="group" aria-label="Filter recipes">${filters.map(([id,label]) => `<button class="chip ${recipeFilter === id ? "active" : ""}" data-recipe-filter="${id}">${label}</button>`).join("")}</div>
    <div class="recipe-grid">${visible.map((recipe, index) => {
      const pref = recipePreference(recipe.id);
      return `<article class="recipe-card" data-preference="${pref}"><div class="recipe-card-art tone-${index % 4 + 1}"><span>${String(index + 1).padStart(2, "0")}</span><span class="tag">${recipe.tags[0]}</span></div><div class="recipe-card-body"><div class="recipe-title-row"><h2><a href="#/recipes/${recipe.id}">${recipe.name}</a></h2><button class="favorite-button ${pref === "favorite" ? "active" : ""}" data-favorite-recipe="${recipe.id}" aria-label="${pref === "favorite" ? "Remove from favorites" : "Add to favorites"}" title="${pref === "favorite" ? "Favorite" : "Add to favorites"}">${pref === "favorite" ? "♥" : "♡"}</button></div><p>${recipe.description}</p><div class="recipe-meta"><span>${recipe.prepTime} prep</span><span>${recipe.servings} servings</span></div><div class="recipe-preference-row"><span class="preference-label">${pref === "favorite" ? "Favorite" : pref === "not-for-me" ? "Not for Me" : "Want to Try"}</span><button class="text-button" data-not-for-me="${recipe.id}">${pref === "not-for-me" ? "Move back to Want to Try" : "Not for Me"}</button></div>${recipeLink(recipe, true)}</div></article>`;
    }).join("") || `<div class="empty-progress"><h2>No recipes here yet.</h2><p>Change the filter to see the rest of the recipe box.</p></div>`}</div></section>`;
}
function recipeSchema(recipe) {
  return JSON.stringify({ "@context": "https://schema.org", "@type": "Recipe", name: recipe.name, description: recipe.description, recipeYield: `${recipe.servings} servings`, prepTime: `PT${parseInt(recipe.prepTime)}M`, cookTime: `PT${parseInt(recipe.cookTime)}M`, recipeIngredient: recipe.ingredients.map((i) => `${formatAmount(i.amount)} ${i.unit} ${i.item}`.replace(/\s+/g, " ").trim()), recipeInstructions: recipe.instructions.map((text) => ({ "@type": "HowToStep", text })), recipeCategory: "Dinner", recipeCuisine: recipe.tags[0], nutrition: { "@type": "NutritionInformation", servingSize: recipe.servingSize } }).replace(/</g, "\\u003c");
}

function recipeDetailView(recipe) {
  const inExtras = extras.includes(recipe.id);
  const pref = recipePreference(recipe.id);
  return `<section class="section-shell page recipe-detail"><a class="back-link" href="#/recipes">← All recipes</a><div class="recipe-hero"><div><p class="eyebrow">${recipe.tags.join(" · ")}</p><div class="recipe-detail-title"><h1>${recipe.name}</h1><button class="favorite-button large ${pref === "favorite" ? "active" : ""}" data-favorite-recipe="${recipe.id}" aria-label="${pref === "favorite" ? "Remove from favorites" : "Add to favorites"}">${pref === "favorite" ? "♥" : "♡"}</button></div><p class="lede">${recipe.description}</p><div class="recipe-preference-detail"><span class="preference-label">${pref === "favorite" ? "Favorite" : pref === "not-for-me" ? "Not for Me" : "Want to Try"}</span><button class="text-button" data-not-for-me="${recipe.id}">${pref === "not-for-me" ? "Move back to Want to Try" : "Not for Me"}</button></div><div class="recipe-actions"><button class="button primary" data-copy-ingredients="${recipe.id}">Copy for MyFitnessPal</button><a class="button secondary" href="https://www.myfitnesspal.com/recipe_parser" target="_blank" rel="noopener">Open MyFitnessPal</a><button class="button secondary" data-add-recipe="${recipe.id}" ${inExtras ? "disabled" : ""}>${inExtras ? "Added to shopping list" : "Add to shopping list"}</button></div></div><dl class="recipe-facts"><div><dt>Servings</dt><dd>${recipe.servings}</dd></div><div><dt>Serving size</dt><dd>${recipe.servingSize}</dd></div><div><dt>Prep</dt><dd>${recipe.prepTime}</dd></div><div><dt>Cook</dt><dd>${recipe.cookTime}</dd></div></dl></div>
    <div class="recipe-content"><article><p class="eyebrow">What you’ll need</p><h2>Ingredients</h2><ul class="ingredient-list">${recipe.ingredients.map((i) => `<li><strong>${formatAmount(i.amount)} ${i.unit}</strong><span>${i.item}${i.optional ? " (as available)" : ""}</span></li>`).join("")}</ul></article><article><p class="eyebrow">At the stove</p><h2>Method</h2><ol class="method-list">${recipe.instructions.map((step) => `<li><span>${step}</span></li>`).join("")}</ol></article></div>
    <div class="detail-grid"><article class="detail-card"><p class="tiny-label">Portions</p><h3>At our table</h3><dl><dt>Alisa</dt><dd>${recipe.portions.alisa}</dd><dt>Mom</dt><dd>${recipe.portions.mom}</dd></dl></article><article class="detail-card"><p class="tiny-label">Nutrition per serving</p><h3>${typeof recipe.nutrition.calories === "number" ? "Calculated" : "Calculation pending"}</h3><dl class="nutrition-list"><dt>Calories</dt><dd>${recipe.nutrition.calories}</dd><dt>Protein</dt><dd>${recipe.nutrition.protein}</dd><dt>Fiber</dt><dd>${recipe.nutrition.fiber}</dd><dt>Saturated fat</dt><dd>${recipe.nutrition.saturatedFat}</dd></dl></article><article class="detail-card"><p class="tiny-label">Keep it well</p><h3>Storage</h3><p>${recipe.storage}</p></article></div><script type="application/ld+json">${recipeSchema(recipe)}</script></section>`;
}

function shoppingView() {
  const items = consolidateShoppingList(activeWeek(), pantry, extras);
  const stores = [{ id: "all", label: "All" }, { id: "ralphs", label: "Ralphs" }, { id: "vons", label: "Vons" }, { id: "northgate", label: "Northgate" }, { id: "sprouts", label: "Sprouts" }];
  const groups = groupShoppingList(items);
  const shopSection = (shop, title, subtitle) => `<section class="shop-section"><div class="shop-heading"><div><p class="eyebrow">${subtitle}</p><h2>${title}</h2></div><span>${Object.values(groups[shop]).flat().length} items</span></div>${Object.keys(groups[shop]).length ? Object.entries(groups[shop]).map(([category, categoryItems]) => `<article class="grocery-category"><h3>${category}</h3>${categoryItems.map((item) => { const id = `${shop}:${item.key}:${item.unitGroup ?? item.unit}`; return `<label class="check-row ${checked.includes(id) ? "checked" : ""}"><input type="checkbox" data-grocery="${id}" ${checked.includes(id) ? "checked" : ""}><span class="custom-check"></span><span>${item.item}</span><strong>${item.displayAmount ?? `${formatAmount(item.amount)} ${item.unit}`}</strong></label>`; }).join("")}</article>`).join("") : `<div class="empty-state">Nothing on this list yet.</div>`}</section>`;
  return `<section class="section-shell page">${pageHeader("This week’s groceries", "Shopping", "One consolidated list, split around how you actually shop. Pantry staples you have are already filtered out.")}<div class="store-filter" role="group" aria-label="Filter shopping list by store">${stores.map((store) => `<button class="chip ${shoppingStoreFilter === store.id ? "active" : ""}" data-store-filter="${store.id}">${store.label}</button>`).join("")}</div><p class="helper-text store-filter-note">${shoppingStoreFilter === "all" ? "Showing the complete list. Store assignments will populate as sale and best-price data is added." : `Store view ready for ${stores.find((store) => store.id === shoppingStoreFilter)?.label}. Items will appear here once store pricing and assignments are connected.`}</p><div class="shopping-toolbar"><span>${icons.cart} <strong>${items.length}</strong> ingredients to pick up</span>${checked.length ? `<button class="button text" data-clear-checked>Clear checked items</button>` : ""}</div><div class="shopping-layout">${shopSection("sunday", "Sunday main shop", "Stock the week")}${shopSection("wednesday", "Wednesday fresh pickup", "Small and fresh")}</div>${extras.length ? `<div class="extras-note"><span>Extra recipe${extras.length > 1 ? "s" : ""} added manually: ${extras.map((id) => getRecipe(id).name).join(", ")}</span><button data-clear-extras>Remove extras</button></div>` : ""}</section>`;
}

function pantryCategory(item) {
  if (["jasmine-rice","basmati-rice","sushi-rice"].includes(item.key)) return "Rice & grains";
  if (["olive-oil","garlic-oil","rice-vinegar","red-wine-vinegar","sesame-oil"].includes(item.key)) return "Oils & vinegars";
  if (["tamari","fish-sauce","dijon","tahini","brown-sugar"].includes(item.key)) return "Sauces & condiments";
  if (["sesame-seeds"].includes(item.key)) return "Seeds & specialty";
  return "Spices & seasonings";
}
function sauceFreshness(s) {
  if (s.status !== "In Fridge" || !s.madeOn) return "";
  const made = new Date(`${s.madeOn}T12:00:00`);
  if (Number.isNaN(made.getTime())) return "";
  const useBy = new Date(made); useBy.setDate(useBy.getDate() + s.storageDays);
  const today = new Date(); today.setHours(12,0,0,0);
  const daysLeft = Math.ceil((useBy - today) / 86400000);
  const label = useBy.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (daysLeft < 0) return `<span class="freshness-alert expired">Past planning window · check batch</span>`;
  if (daysLeft <= 2) return `<span class="freshness-alert use-first">Use first · by ${label}</span>`;
  return `<span class="freshness-alert">Use by ${label}</span>`;
}
function pantryView() {
  const normalizedPantry = pantry.map((item) => item.status === "Use First" ? { ...item, status: "Have" } : item);
  if (normalizedPantry.some((item, i) => item.status !== pantry[i].status)) { pantry = normalizedPantry; store.set("fk-pantry", pantry); }
  const statusCounts = pantryStatuses.map((status) => [status, pantry.filter((item) => item.status === status).length]);
  const visible = pantryFilter === "all" ? pantry : pantry.filter((item) => item.status === pantryFilter);
  const groups = visible.reduce((out,item) => { const category=pantryCategory(item); (out[category] ??= []).push(item); return out; }, {});
  const plannedRecipeIds = new Set(activeWeek().days.flatMap((day) => Object.values(day.meals).flat()).filter((entry) => typeof entry === "string"));
  let sauceStateChanged = false;
  preparedSauces = preparedSauces.map((s) => {
    const plannedThisWeek = plannedRecipeIds.has(s.recipeId);
    const nextStatus = s.status === "In Fridge" ? "In Fridge" : plannedThisWeek ? "Make" : "Out";
    if (nextStatus !== s.status) sauceStateChanged = true;
    return { ...s, status: nextStatus, plannedThisWeek };
  });
  if (sauceStateChanged) store.set("fk-prepared-sauces", preparedSauces);
  const plannedSauces = preparedSauces;
  const row = (item) => `<div class="pantry-row"><div><span class="pantry-dot status-${item.status.toLowerCase()}"></span><strong>${item.name}</strong></div><label><span class="sr-only">Status for ${item.name}</span><select data-pantry-key="${item.key}">${pantryStatuses.map((status) => `<option ${status === item.status ? "selected" : ""}>${status}</option>`).join("")}</select></label></div>`;
  return `<section class="section-shell page pantry-page">${pageHeader("Know what you have", "Pantry", "Keep staples visible and prevent repeat buys. Changes are saved on this device.")}
    <div class="pantry-filter-bar"><button class="pantry-all ${pantryFilter === "all" ? "active" : ""}" data-pantry-filter="all">All <span>${pantry.length}</span></button><div class="pantry-summary">${statusCounts.map(([status,count])=>`<button class="${pantryFilter === status ? "active" : ""}" data-pantry-filter="${status}"><strong>${count}</strong><span>${status}</span></button>`).join("")}</div></div>
    <div class="pantry-groups">${Object.entries(groups).map(([category,items])=>`<section class="pantry-group"><div class="pantry-category"><h2>${category}</h2><span>${items.length} item${items.length===1?"":"s"}</span></div><div class="pantry-list"><div class="pantry-list-head"><span>Staple</span><span>Status</span></div>${items.map(row).join("")}</div></section>`).join("") || '<div class="empty-state">No pantry items in this filter.</div>'}</div>
    <section class="prepared-sauces"><div class="prepared-heading"><div><p class="eyebrow">Ready-made components</p><h2>Prepared sauces & dressings</h2></div><p>Keep the full sauce inventory visible. Weekly recipes are flagged separately so existing fridge batches can be used before making more.</p></div><div class="prepared-list"><div class="prepared-list-head"><span>Sauce or dressing</span><span>Storage</span><span>Status</span></div>${plannedSauces.map((s)=>`<div class="prepared-row"><div><strong>${s.name}</strong><small>${s.plannedThisWeek ? '<span class="planned-badge">Planned this week</span> · ' : ""}Best used within about ${s.storageDays} days when freshly made. ${sauceFreshness(s)}</small></div><span class="storage-pill">${s.storage}</span><div class="prepared-controls"><label><span class="sr-only">Status for ${s.name}</span><select data-sauce-key="${s.key}">${preparedSauceStatuses.map((status)=>`<option ${status===s.status?"selected":""}>${status}</option>`).join("")}</select></label><label class="made-on"><span>Made on</span><input type="date" data-sauce-date="${s.key}" value="${s.madeOn || ""}" ${s.status !== "In Fridge" ? "disabled" : ""}></label></div></div>`).join("")}</div></section>
    <p class="helper-text"><strong>Prepared sauce statuses:</strong> <strong>Make</strong> means prepare a batch for the plan, <strong>In Fridge</strong> means use the existing batch first, and <strong>Out</strong> means none is currently prepared.</p>
    <p class="helper-text"><strong>Have</strong> means it is already in the house. <strong>Low</strong> adds it to Shopping when this week needs it. <strong>Buy</strong> always adds it to Shopping. Fresh-food priority is handled by the weekly meal plan, not as a Pantry status.</p></section>`;
}

function progressView() {
  return `<section class="section-shell page">${pageHeader("A gentle record", "Progress", "Planning patterns, not calorie targets. MyFitnessPal remains the home for actual food logging.")}<div class="progress-grid"><article class="progress-feature"><p class="eyebrow">Week 1 intention</p><h2>Cook five flexible dinners and use the good leftovers.</h2><div class="progress-stats"><div><strong>5</strong><span>planned dinners</span></div><div><strong>2</strong><span>open evenings</span></div><div><strong>1</strong><span>use-it-up night</span></div></div></article><article class="detail-card"><p class="tiny-label">Coming later</p><h3>Useful, low-pressure trends</h3><ul class="clean-list"><li>Recipes cooked and repeated</li><li>Weekly planning consistency</li><li>Pantry ingredients used first</li><li>Personal notes on what worked</li></ul></article></div><div class="empty-progress"><span class="icon-disc">${icons.leaf}</span><h2>Your kitchen history starts here.</h2><p>Future weeks can add a simple reflection without turning dinner into a score.</p></div></section>`;
}

function render(options = {}) {
  const preserveScroll = options.preserveScroll === true;
  const scrollY = window.scrollY;
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const route = parts[0] || "home";
  const recipe = route === "recipes" && parts[1] ? getRecipe(parts[1]) : null;
  app.innerHTML = recipe ? recipeDetailView(recipe) : ({ home: homeView, week: weekView, prep: prepView, "past-weeks": pastWeeksView, recipes: recipesView, shopping: shoppingView, pantry: pantryView, progress: progressView }[route] || homeView)();
  document.querySelectorAll("[data-nav]").forEach((link) => link.classList.toggle("active", link.dataset.nav === route));
  document.title = `${recipe?.name || ({ home: "Home", week: "This Week", prep: "Prep", "past-weeks": "Past Weeks", recipes: "Recipes", shopping: "Shopping", pantry: "Pantry", progress: "Progress" }[route] || "Home")} · Family Kitchen`;
  updateShoppingCount();
  nav.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false");
  if (preserveScroll) window.scrollTo(0, scrollY);
  else if (route === "prep" && parts[1]) requestAnimationFrame(() => document.getElementById(parts[1])?.scrollIntoView({ behavior: "smooth", block: "start" }));
  else window.scrollTo(0, 0);
}

function updateShoppingCount() { const count = consolidateShoppingList(activeWeek(), pantry, extras).length; const badge = document.querySelector("#shopping-count"); badge.textContent = count; badge.hidden = !count; }
function ingredientsText(recipe) { return `${recipe.name}\n${recipe.servings} servings\n\n${recipe.ingredients.map((i) => `${formatAmount(i.amount)} ${i.unit} ${i.item}`.replace(/\s+/g, " ").trim()).join("\n")}`; }

document.addEventListener("click", async (event) => {
  const moveMeal = event.target.closest("[data-move-meal]");
  if (moveMeal) { mealMoves.push({ day: moveMeal.dataset.day, meal: moveMeal.dataset.meal, index: Number(moveMeal.dataset.index) }); store.set("fk-meal-moves", mealMoves); render(); showToast("Meal moved to the next open slot"); return; }
  const copy = event.target.closest("[data-copy-ingredients]");
  if (copy) { const recipe = getRecipe(copy.dataset.copyIngredients); await navigator.clipboard.writeText(ingredientsText(recipe)); showToast("Ingredients copied for MyFitnessPal"); }
  const add = event.target.closest("[data-add-recipe]");
  if (add && !extras.includes(add.dataset.addRecipe)) { extras.push(add.dataset.addRecipe); store.set("fk-shopping-extras", extras); add.disabled = true; add.textContent = "Added to shopping list"; updateShoppingCount(); showToast("Recipe added to shopping list"); }
  const clearExtras = event.target.closest("[data-clear-extras]"); if (clearExtras) { extras = []; store.set("fk-shopping-extras", extras); render(); }
  const clearChecked = event.target.closest("[data-clear-checked]"); if (clearChecked) { checked = []; store.set("fk-shopping-checked", checked); render(); }
  const storeFilterButton = event.target.closest("[data-store-filter]"); if (storeFilterButton) { shoppingStoreFilter = storeFilterButton.dataset.storeFilter; render({ preserveScroll: true }); return; }
  const pantryFilterButton = event.target.closest("[data-pantry-filter]"); if (pantryFilterButton) { pantryFilter = pantryFilterButton.dataset.pantryFilter; render(); return; }
  const favorite = event.target.closest("[data-favorite-recipe]");
  if (favorite) {
    const id = favorite.dataset.favoriteRecipe;
    setRecipePreference(id, recipePreference(id) === "favorite" ? "want-to-try" : "favorite");
    render({ preserveScroll: true });
    showToast(recipePreference(id) === "favorite" ? "Added to favorites" : "Moved to Want to Try");
    return;
  }
  const notForMe = event.target.closest("[data-not-for-me]");
  if (notForMe) {
    const id = notForMe.dataset.notForMe;
    setRecipePreference(id, recipePreference(id) === "not-for-me" ? "want-to-try" : "not-for-me");
    render({ preserveScroll: true });
    showToast(recipePreference(id) === "not-for-me" ? "Marked Not for Me" : "Moved to Want to Try");
    return;
  }
  const recipeFilterButton = event.target.closest("[data-recipe-filter]");
  if (recipeFilterButton) { recipeFilter = recipeFilterButton.dataset.recipeFilter; render({ preserveScroll: true }); return; }
  const chip = event.target.closest("[data-filter]"); if (chip) { document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === chip)); document.querySelectorAll(".recipe-card").forEach((card) => { card.hidden = chip.dataset.filter !== "all" && card.dataset.kind !== chip.dataset.filter; }); }
});
document.addEventListener("change", (event) => {
  if (event.target.matches("[data-sauce-date]")) { preparedSauces = preparedSauces.map((item) => item.key === event.target.dataset.sauceDate ? { ...item, madeOn: event.target.value } : item); store.set("fk-prepared-sauces", preparedSauces); render({ preserveScroll: true }); return; }
  if (event.target.matches("[data-sauce-key]")) { preparedSauces = preparedSauces.map((item) => item.key === event.target.dataset.sauceKey ? { ...item, status: event.target.value, madeOn: event.target.value === "In Fridge" ? item.madeOn : "" } : item); store.set("fk-prepared-sauces", preparedSauces); showToast(`${event.target.value}: prepared sauce updated`); render({ preserveScroll: true }); return; }
  if (event.target.matches("[data-pantry-key]")) { pantry = pantry.map((item) => item.key === event.target.dataset.pantryKey ? { ...item, status: event.target.value } : item); store.set("fk-pantry", pantry); showToast(`${event.target.value}: pantry updated`); render({ preserveScroll: true }); }
  if (event.target.matches("[data-grocery]")) { const id = event.target.dataset.grocery; checked = event.target.checked ? [...new Set([...checked, id])] : checked.filter((item) => item !== id); store.set("fk-shopping-checked", checked); event.target.closest(".check-row").classList.toggle("checked", event.target.checked); }
});
menuButton.addEventListener("click", () => { const open = nav.classList.toggle("open"); menuButton.setAttribute("aria-expanded", String(open)); });
window.addEventListener("hashchange", render);
if (!location.hash) history.replaceState(null, "", "#/home");
render();
