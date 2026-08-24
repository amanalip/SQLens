# SQLens

<p align="center">
  <img src="public/sqlens-logo.svg" alt="SQLens Detective Logo" width="140" height="140" />
</p>

<p align="center">
  <strong>Clarity for every query.</strong>
</p>

SQLens is a browser-based tool that turns SQL queries into interactive visual data flow graphs and executes them against real databases inside your browser. No backend services, no user accounts, and no data leaving your machine.

The application runs entirely client-side as a static web app. Query execution is powered by SQLite compiled to WebAssembly (`sql.js`) inside a Web Worker.

---

## Features

- **Query Flow DAG**: Transforms SQL queries into visual data flow graphs showing table sources, joins, filters, aggregates, groupings, sorting, and output projections.
- **Schema Explorer (ER Diagrams)**: Renders entity-relationship diagrams from database schemas with primary keys, foreign keys, and relationship links.
- **In-Browser SQLite Playground**: Runs real queries in a background Web Worker without blocking the main UI thread.
- **13 Bundled Public Databases**: Pre-loaded SQLite datasets with curated educational queries.
- **CodeMirror 6 Editor**: SQL syntax highlighting, bracket matching, schema-aware autocomplete for tables and columns, and `Ctrl+Enter` execution.
- **Diagnostics**: Real-time syntax and structural query warnings with click-to-jump line navigation.
- **Sharing & Export**: URL state compression via LZ-string to share queries, plus PNG export for graph diagrams and CSV export for results.
- **Dark & Light Themes**: High-contrast palettes with persistent local storage preferences.

---

## Bundled Databases

| Database | Description | Size | Sample Concepts |
|---|---|---|---|
| **Chinook** | Digital media store (artists, tracks, invoices) | ~1 MB | JOINs, GROUP BY, subqueries |
| **Northwind** | Commercial trading (orders, products, suppliers) | ~1.5 MB | Multi-table JOINs, aggregations |
| **Sakila** | DVD rental store (films, actors, rentals) | ~2 MB | Self-joins, date filtering |
| **World** | Geographic demographic data | ~400 KB | Basic filters, aggregation |
| **Employees** | Enterprise staff records (departments, titles) | ~500 KB | CTEs, window calculations |
| **Formula 1** | F1 championship (races, drivers, circuits) | ~1.5 MB | Ranking, analytics, points calculation |
| **Classicmodels** | Scale models retailer (products, sales, orders) | ~1 MB | Sales reporting, balances, hierarchies |
| **IMDb Movies** | Film catalog (movies, directors, cast) | ~1 MB | Text search, rating averages |
| **Spotify Music** | Track audio metrics (danceability, energy) | ~1 MB | CASE classification, audio averages |
| **Pokemon** | Species, combat stats, elemental types | ~500 KB | Stat totals, type groupings |
| **University** | Student enrollment and course catalog | ~500 KB | Transcripts, class size CTEs |
| **Premier League** | Football matches, standings, goal scorers | ~1 MB | Table standings calculation, points CTE |
| **E-Commerce** | Online orders, product categories, reviews | ~1.5 MB | Review averages, seller performance |

---

## Tech Stack

- **Build**: Vite
- **UI**: React 19 + TypeScript (strict mode)
- **Styling**: CSS Modules
- **SQL Engine**: sql.js (SQLite WebAssembly in Web Worker)
- **SQL Parser**: node-sql-parser
- **Graph Engine**: @xyflow/react (React Flow)
- **Editor**: CodeMirror 6 + @codemirror/lang-sql
- **Results Table**: @tanstack/react-table
- **URL Compression**: lz-string
- **Image Export**: html-to-image
- **Testing**: Vitest

---

## Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run unit tests
npm test

# Build production bundle
npm run build
```

---

## License

GNU General Public License v3.0
