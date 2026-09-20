import { activeWeekId, getActiveWeek, getRecipe, initialPantry, pantryStatuses, recipes } from "./data.js";
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

function weekView() {
  const week = activeWeek();
  return `<section class="section-shell page">${pageHeader(`${week.label} · ${week.dateRange}`, "This week", "A flexible five-dinner rhythm with two intentional openings for life outside the kitchen.")}
    <div class="week-layout"><div class="day-list">${week.days.map((day) => `<article class="day-card"><div class="day-name"><span>${day.day.slice(0, 3)}</span><h2>${day.day}</h2></div><div class="day-content">${day.theme ? `<p class="tiny-label">${day.theme}</p>` : ""}${["breakfast","lunch","dinner","snack"].map((meal) => `<div class="meal-slot"><p class="tiny-label">${meal}</p>${day.meals[meal].length ? day.meals[meal].map((id) => recipeLink(getRecipe(id))).join("") : `<p class="day-note">Open</p>`}</div>`).join("")}${day.note ? `<p class="day-note">${day.note}</p>` : ""}</div></article>`).join("")}</div>
    <aside class="week-sidebar"><article class="note-card"><span class="number-disc">01</span><p class="tiny-label">Sunday prep</p><h3>A little now, easier later</h3><ul class="clean-list">${week.sundayPrep.map((item) => `<li>${item}</li>`).join("")}</ul></article><article class="note-card green"><span class="number-disc">02</span><p class="tiny-label">Wednesday pickup</p><h3>Fresh things, small trip</h3><ul class="clean-list">${week.wednesdayPickup.map((item) => `<li>${item}</li>`).join("")}</ul></article></aside></div></section>`;
}

function recipesView() {
  return `<section class="section-shell page">${pageHeader("The recipe box", "Permanent favorites", "Recipes live here once and can be reused in every weekly plan.")}
    <div class="filter-row" role="group" aria-label="Filter recipes"><button class="chip active" data-filter="all">All recipes</button><button class="chip" data-filter="main">Mains</button><button class="chip" data-filter="sauce">Sauces</button><button class="chip" data-filter="fresh">Fresh sides</button></div>
    <div class="recipe-grid">${recipes.map((recipe, index) => `<article class="recipe-card" data-tags="${recipe.tags.join(" ").toLowerCase()}" data-kind="${recipe.tags.includes("Sauce") ? "sauce" : recipe.tags.some((tag) => ["Fresh", "Salad", "Vegetarian"].includes(tag)) ? "fresh" : "main"}"><div class="recipe-card-art tone-${index % 4 + 1}"><span>${String(index + 1).padStart(2, "0")}</span><span class="tag">${recipe.tags[0]}</span></div><div class="recipe-card-body"><h2><a href="#/recipes/${recipe.id}">${recipe.name}</a></h2><p>${recipe.description}</p><div class="recipe-meta"><span>${recipe.prepTime} prep</span><span>${recipe.servings} servings</span></div>${recipeLink(recipe, true)}</div></article>`).join("")}</div></section>`;
}

function recipeSchema(recipe) {
  return JSON.stringify({ "@context": "https://schema.org", "@type": "Recipe", name: recipe.name, description: recipe.description, recipeYield: `${recipe.servings} servings`, prepTime: `PT${parseInt(recipe.prepTime)}M`, cookTime: `PT${parseInt(recipe.cookTime)}M`, recipeIngredient: recipe.ingredients.map((i) => `${formatAmount(i.amount)} ${i.unit} ${i.item}`.replace(/\s+/g, " ").trim()), recipeInstructions: recipe.instructions.map((text) => ({ "@type": "HowToStep", text })), recipeCategory: "Dinner", recipeCuisine: recipe.tags[0], nutrition: { "@type": "NutritionInformation", servingSize: recipe.servingSize } }).replace(/</g, "\\u003c");
}

function recipeDetailView(recipe) {
  const inExtras = extras.includes(recipe.id);
  return `<section class="section-shell page recipe-detail"><a class="back-link" href="#/recipes">← All recipes</a><div class="recipe-hero"><div><p class="eyebrow">${recipe.tags.join(" · ")}</p><h1>${recipe.name}</h1><p class="lede">${recipe.description}</p><div class="recipe-actions"><button class="button primary" data-copy-ingredients="${recipe.id}">Copy ingredients</button><button class="button secondary" data-add-recipe="${recipe.id}" ${inExtras ? "disabled" : ""}>${inExtras ? "Added to shopping list" : "Add to shopping list"}</button></div></div><dl class="recipe-facts"><div><dt>Servings</dt><dd>${recipe.servings}</dd></div><div><dt>Serving size</dt><dd>${recipe.servingSize}</dd></div><div><dt>Prep</dt><dd>${recipe.prepTime}</dd></div><div><dt>Cook</dt><dd>${recipe.cookTime}</dd></div></dl></div>
    <div class="recipe-content"><article><p class="eyebrow">What you’ll need</p><h2>Ingredients</h2><ul class="ingredient-list">${recipe.ingredients.map((i) => `<li><strong>${formatAmount(i.amount)} ${i.unit}</strong><span>${i.item}${i.optional ? " (as available)" : ""}</span></li>`).join("")}</ul></article><article><p class="eyebrow">At the stove</p><h2>Method</h2><ol class="method-list">${recipe.instructions.map((step) => `<li><span>${step}</span></li>`).join("")}</ol></article></div>
    <div class="detail-grid"><article class="detail-card"><p class="tiny-label">Portions</p><h3>At our table</h3><dl><dt>Alisa</dt><dd>${recipe.portions.alisa}</dd><dt>Mom</dt><dd>${recipe.portions.mom}</dd></dl></article><article class="detail-card"><p class="tiny-label">Nutrition per serving</p><h3>Ready to calculate</h3><dl class="nutrition-list"><dt>Calories</dt><dd>${recipe.nutrition.calories}</dd><dt>Protein</dt><dd>${recipe.nutrition.protein}</dd><dt>Fiber</dt><dd>${recipe.nutrition.fiber}</dd><dt>Saturated fat</dt><dd>${recipe.nutrition.saturatedFat}</dd></dl></article><article class="detail-card"><p class="tiny-label">Keep it well</p><h3>Storage</h3><p>${recipe.storage}</p></article></div><script type="application/ld+json">${recipeSchema(recipe)}</script></section>`;
}

function shoppingView() {
  const items = consolidateShoppingList(activeWeek(), pantry, extras);
  const groups = groupShoppingList(items);
  const shopSection = (shop, title, subtitle) => `<section class="shop-section"><div class="shop-heading"><div><p class="eyebrow">${subtitle}</p><h2>${title}</h2></div><span>${Object.values(groups[shop]).flat().length} items</span></div>${Object.keys(groups[shop]).length ? Object.entries(groups[shop]).map(([category, categoryItems]) => `<article class="grocery-category"><h3>${category}</h3>${categoryItems.map((item) => { const id = `${shop}:${item.key}:${item.unit}`; return `<label class="check-row ${checked.includes(id) ? "checked" : ""}"><input type="checkbox" data-grocery="${id}" ${checked.includes(id) ? "checked" : ""}><span class="custom-check"></span><span>${item.item}</span><strong>${formatAmount(item.amount)} ${item.unit}</strong></label>`; }).join("")}</article>`).join("") : `<div class="empty-state">Nothing on this list yet.</div>`}</section>`;
  return `<section class="section-shell page">${pageHeader("This week’s groceries", "Shopping", "One consolidated list, split around how you actually shop. Pantry staples you have are already filtered out.")}<div class="shopping-toolbar"><span>${icons.cart} <strong>${items.length}</strong> ingredients to pick up</span>${checked.length ? `<button class="button text" data-clear-checked>Clear checked items</button>` : ""}</div><div class="shopping-layout">${shopSection("sunday", "Sunday main shop", "Stock the week")}${shopSection("wednesday", "Wednesday fresh pickup", "Small and fresh")}</div>${extras.length ? `<div class="extras-note"><span>Extra recipe${extras.length > 1 ? "s" : ""} added manually: ${extras.map((id) => getRecipe(id).name).join(", ")}</span><button data-clear-extras>Remove extras</button></div>` : ""}</section>`;
}

function pantryView() {
  const statusCounts = pantryStatuses.map((status) => [status, pantry.filter((item) => item.status === status).length]);
  return `<section class="section-shell page">${pageHeader("Know what you have", "Pantry", "Keep staples visible and prevent repeat buys. Changes are saved on this device.")}<div class="pantry-summary">${statusCounts.map(([status, count]) => `<div><strong>${count}</strong><span>${status}</span></div>`).join("")}</div><div class="pantry-list"><div class="pantry-list-head"><span>Staple</span><span>Status</span></div>${pantry.map((item) => `<div class="pantry-row"><div><span class="pantry-dot status-${item.status.toLowerCase().replace(" ", "-")}"></span><strong>${item.name}</strong></div><label><span class="sr-only">Status for ${item.name}</span><select data-pantry-key="${item.key}">${pantryStatuses.map((status) => `<option ${status === item.status ? "selected" : ""}>${status}</option>`).join("")}</select></label></div>`).join("")}</div><p class="helper-text">Items marked <strong>Have</strong> or <strong>Use First</strong> are excluded from the generated shopping list. <strong>Low</strong> and <strong>Buy</strong> items stay visible when a recipe needs them.</p></section>`;
}

function progressView() {
  return `<section class="section-shell page">${pageHeader("A gentle record", "Progress", "Planning patterns, not calorie targets. MyFitnessPal remains the home for actual food logging.")}<div class="progress-grid"><article class="progress-feature"><p class="eyebrow">Week 1 intention</p><h2>Cook five flexible dinners and use the good leftovers.</h2><div class="progress-stats"><div><strong>5</strong><span>planned dinners</span></div><div><strong>2</strong><span>open evenings</span></div><div><strong>1</strong><span>use-it-up night</span></div></div></article><article class="detail-card"><p class="tiny-label">Coming later</p><h3>Useful, low-pressure trends</h3><ul class="clean-list"><li>Recipes cooked and repeated</li><li>Weekly planning consistency</li><li>Pantry ingredients used first</li><li>Personal notes on what worked</li></ul></article></div><div class="empty-progress"><span class="icon-disc">${icons.leaf}</span><h2>Your kitchen history starts here.</h2><p>Future weeks can add a simple reflection without turning dinner into a score.</p></div></section>`;
}

function render() {
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const route = parts[0] || "home";
  const recipe = route === "recipes" && parts[1] ? getRecipe(parts[1]) : null;
  app.innerHTML = recipe ? recipeDetailView(recipe) : ({ home: homeView, week: weekView, recipes: recipesView, shopping: shoppingView, pantry: pantryView, progress: progressView }[route] || homeView)();
  document.querySelectorAll("[data-nav]").forEach((link) => link.classList.toggle("active", link.dataset.nav === route));
  document.title = `${recipe?.name || ({ home: "Home", week: "This Week", recipes: "Recipes", shopping: "Shopping", pantry: "Pantry", progress: "Progress" }[route] || "Home")} · Family Kitchen`;
  updateShoppingCount();
  nav.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false");
  window.scrollTo(0, 0);
}

function updateShoppingCount() { const count = consolidateShoppingList(activeWeek(), pantry, extras).length; const badge = document.querySelector("#shopping-count"); badge.textContent = count; badge.hidden = !count; }
function ingredientsText(recipe) { return `${recipe.name}\n${recipe.servings} servings\n\n${recipe.ingredients.map((i) => `${formatAmount(i.amount)} ${i.unit} ${i.item}`.replace(/\s+/g, " ").trim()).join("\n")}`; }

document.addEventListener("click", async (event) => {
  const copy = event.target.closest("[data-copy-ingredients]");
  if (copy) { const recipe = getRecipe(copy.dataset.copyIngredients); await navigator.clipboard.writeText(ingredientsText(recipe)); showToast("Ingredients copied for MyFitnessPal"); }
  const add = event.target.closest("[data-add-recipe]");
  if (add && !extras.includes(add.dataset.addRecipe)) { extras.push(add.dataset.addRecipe); store.set("fk-shopping-extras", extras); add.disabled = true; add.textContent = "Added to shopping list"; updateShoppingCount(); showToast("Recipe added to shopping list"); }
  const clearExtras = event.target.closest("[data-clear-extras]"); if (clearExtras) { extras = []; store.set("fk-shopping-extras", extras); render(); }
  const clearChecked = event.target.closest("[data-clear-checked]"); if (clearChecked) { checked = []; store.set("fk-shopping-checked", checked); render(); }
  const chip = event.target.closest("[data-filter]"); if (chip) { document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === chip)); document.querySelectorAll(".recipe-card").forEach((card) => { card.hidden = chip.dataset.filter !== "all" && card.dataset.kind !== chip.dataset.filter; }); }
});
document.addEventListener("change", (event) => {
  if (event.target.matches("[data-pantry-key]")) { pantry = pantry.map((item) => item.key === event.target.dataset.pantryKey ? { ...item, status: event.target.value } : item); store.set("fk-pantry", pantry); showToast(`${event.target.value}: pantry updated`); render(); }
  if (event.target.matches("[data-grocery]")) { const id = event.target.dataset.grocery; checked = event.target.checked ? [...new Set([...checked, id])] : checked.filter((item) => item !== id); store.set("fk-shopping-checked", checked); event.target.closest(".check-row").classList.toggle("checked", event.target.checked); }
});
menuButton.addEventListener("click", () => { const open = nav.classList.toggle("open"); menuButton.setAttribute("aria-expanded", String(open)); });
window.addEventListener("hashchange", render);
if (!location.hash) history.replaceState(null, "", "#/home");
render();
