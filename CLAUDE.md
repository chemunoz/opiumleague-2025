# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:4200 (hot reload)
npm run build      # Production build → dist/opiumleague-2025/
npm run watch      # Dev build with watch mode
npm test           # Unit tests with Karma/Jasmine in Chrome
npm run lint       # Angular linter
```

To run a single spec file:

```bash
npx ng test --include='src/app/charts/charts.component.spec.ts'
```

To generate a new standalone component:

```bash
npx ng generate component feature/my-component
```

## Architecture

**Angular 19 standalone app** with lazy-loaded routes, Tailwind CSS for styling, Chart.js for charts, and Font Awesome for icons. No backend — all data is static JSON loaded at startup.

### Data flow

All application data originates from two JSON files in `public/assets/data/`:

- `data.json` — array of `Player` objects with raw `points[]` per jornada (round)
- `champions.json` — Champions competition structure (groups, rounds, countdowns)

**`DataService`** (`src/app/core/services/data.service.ts`) is the central service. It loads `data.json` at startup into an Angular `signal`, then runs `calculatePlayers()` which computes all derived stats (cumulative scores, per-jornada rankings, positions, best/worst/average, trend arrows). Components never compute stats themselves — they call `readPlayers()`, `getPlayer(id)`, or `getJornadas()`.

**`ChampionsService`** loads `champions.json` into signals and exposes groups/rounds/countdowns as computed signals.

**`ChartService`** is a thin wrapper around Chart.js that manages chart lifecycle (create/destroy by canvas ID) and provides `createLineChart`, `createBarChart`, and `createPieChart` helpers.

### Routing

All routes use lazy-loaded standalone components (`loadComponent`). Routes are defined in `src/app/app.routes.ts`. The shell (`AppComponent`) renders `<app-header>`, `<app-menu>`, and `<router-outlet>`.

### Feature modules (by folder)

| Folder                        | Routes                                                                                                   |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- |
| `home/`                       | `/`                                                                                                      |
| `table/`                      | `/table`, `/table-friends`                                                                               |
| `charts/`                     | `/charts`                                                                                                |
| `competitions/`               | `/competitions`, `/cup`, `/champions`, `/uefa`, `/supercup-europa`, `/supercup-spain`, `/supercup-opium` |
| `gallery/`                    | `/gallery`, `/profile/:id`                                                                               |
| `news/`, `rules/`, `history/` | `/news`, `/rules`, `/history`                                                                            |
| `layout/`                     | Header and menu shared components                                                                        |

### Models (`src/app/core/models/`)

Key interfaces: `Player` (base data + computed stats), `TeamStanding`, `Jornada`, `Match`, `ChampionsGroup/Round/Countdown`. All exported from `index.ts`.

### Styling

Tailwind with a custom dark theme palette defined in `tailwind.config.js`:

- `primary`: `#1a1a2e`, `secondary`: `#16213e`, `accent`: `#e94560`
- `opium-dark`: `#0f0f23`, `opium-light`: `#f8f9fa`

Component styles default to `.css` files (set in `angular.json` schematics). Global styles in `src/styles.css`.

### Change detection

`AppComponent` uses `ChangeDetectionStrategy.OnPush`. New components should also use `OnPush` where possible.
