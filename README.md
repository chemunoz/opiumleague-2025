# Opium League 2025

Fantasy football league tracker built with Angular 21. No backend — all data is static JSON loaded at startup.

## Tech stack

- **Angular 21** — standalone components, signals, lazy-loaded routes, OnPush change detection
- **Tailwind CSS** — dark theme with custom palette (`primary`, `secondary`, `accent`)
- **Chart.js** — line, bar, and pie charts via `ChartService`
- **Font Awesome 7** — icons
- **Karma / Jasmine** — unit tests

## Commands

```bash
npm start          # Dev server at http://localhost:4200 (hot reload)
npm run build      # Production build → dist/opiumleague-2025/
npm run watch      # Dev build with watch mode
npm test           # Unit tests with Karma/Jasmine in Chrome
npm run lint       # Angular ESLint linter
npm run lint:fix   # Prettier + ESLint auto-fix
npm run check      # lint + tests + build (full CI check)
```

To run a single spec file:

```bash
npx ng test --include='src/app/charts/charts.component.spec.ts'
```

To generate a new standalone component:

```bash
npx ng generate component feature/my-component
```

## Data

All application data lives in `public/assets/data/`:

- `data.json` — array of `Player` objects with raw `points[]` per jornada (round)
- `champions.json` — Champions competition structure (groups, rounds, countdowns)

`DataService` loads `data.json` at startup into a signal and computes all derived stats (cumulative scores, rankings, positions, trends). Components never compute stats themselves — they call `readPlayers()`, `getPlayer(id)`, or `getJornadas()`.

## Features / routes

| Route                                                    | Feature                          |
| -------------------------------------------------------- | -------------------------------- |
| `/`                                                      | Home / overview                  |
| `/table`, `/table-friends`                               | League standings                 |
| `/charts`                                                | Score charts                     |
| `/competitions`                                          | All competitions overview        |
| `/cup`, `/champions`, `/uefa`                            | Knock-out and group competitions |
| `/supercup-europa`, `/supercup-spain`, `/supercup-opium` | Super cups                       |
| `/gallery`, `/profile/:id`                               | Player gallery and profiles      |
| `/news`, `/rules`, `/history`                            | Content pages                    |

## Project structure

```
src/app/
  core/           # DataService, ChampionsService, ChartService, models
  layout/         # AppHeader, AppMenu (shared shell components)
  home/
  table/
  charts/
  competitions/
  gallery/
  news/
  rules/
  history/
```
