# Family Kitchen

A warm, mobile-first weekly meal planner built as a dependency-free static site. Recipes, weekly plans, pantry status, and shopping-list generation are kept as plain JavaScript data so they are easy to update by hand or with an AI coding assistant.

## Run locally

The app uses JavaScript modules, so serve the folder rather than opening `index.html` directly:

```bash
python3 -m http.server 4173
```

Then visit [http://localhost:4173](http://localhost:4173). No install or build step is required.

Run the data and shopping-list checks with:

```bash
npm test
```

## Project structure

```text
.
├── index.html          # Application shell and metadata
├── styles.css          # Responsive design system and components
├── src/
│   ├── app.js          # Views, routing, interactions, and rendering
│   ├── data.js         # Recipes, weeks, pantry inventory, and helpers
│   └── shopping.js     # Grocery consolidation and pantry filtering
└── tests/data.test.mjs # Data integrity and shopping-list checks
```

## How the data works

### Recipes

`src/data.js` exports a `recipes` array. Each recipe has a permanent, URL-safe `id`, ingredient records, method steps, portions, storage notes, tags, and nutrition fields. Weekly plans only store recipe IDs, so one recipe can be reused in any number of weeks without copying it.

To add a recipe:

1. Copy an existing object in `recipes`.
2. Give it a unique `id`.
3. Fill in its metadata, ingredient objects, and instructions.
4. Add the ID to a meal in a weekly plan when needed.

Ingredient records use a shared `key` for consolidation, a readable `item` name, an amount and unit, a grocery category, and an optional `pickup: "wednesday"`. Keep the same `key` and unit when the same ingredient appears across recipes so quantities combine cleanly.

### Weekly plans

`weeks` in `src/data.js` contains structured weekly plans. Each day can contain a note plus a list of reusable recipe IDs. Empty days are intentional and render as open days.

To create Week 2, copy the Week 1 object, update `id`, label, date range, prep/pickup notes, and each day’s recipe IDs. Set `activeWeekId` to the new week’s ID when it should appear on the dashboard.

### Pantry and shopping

`initialPantry` contains staples and one of four statuses: `Have`, `Low`, `Buy`, or `Use First`. Pantry changes persist in the browser using `localStorage`; they do not change the source file.

`src/shopping.js` gathers ingredients from the active week’s recipe IDs, consolidates matching ingredient keys, and excludes pantry staples marked `Have` or `Use First`. Items explicitly marked `Low` or `Buy` remain on the list. The Shopping page also supports adding a whole recipe from its recipe page; these additions are stored locally in the browser.

## Static deployment

The repository can be deployed as-is to any static host (GitHub Pages, Netlify, Cloudflare Pages, or similar). Configure the host to publish the repository root. Because navigation uses URL hashes, it does not require server-side route rewrites.

Before a public deployment, consider adding an automated accessibility audit, real nutrition calculations, a print-friendly shopping view, and an export/import option for browser-stored pantry changes.
