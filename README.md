# figma-interactive-demos

A local React app for designers to build runnable interactive demos from Figma
mockups. Think "Storybook, but for full flows instead of individual components."

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). You'll see a grid
of demos; click one to pick a scenario and start.

## Run it on your phone (Expo Go)

```bash
npm run mobile
```

That's it — the script installs everything, builds the demos, and starts Expo.
A QR code appears; scan it with Expo Go (iOS Camera app works too). Your phone
and laptop must be on the same WiFi network. See `run-mobile.sh` for details.

## Scripts

| Command          | What it does                              |
| ---------------- | ----------------------------------------- |
| `npm run dev`    | Vite dev server with hot reload           |
| `npm run build`  | Type-check with `tsc` and build for prod  |
| `npm run lint`   | ESLint (includes the flow-isolation rule) |
| `npm run mobile` | Build + launch the Expo Go wrapper        |

## What's here

```
src/
├── main.tsx, App.tsx         # app entry + top-level routes
├── design/                   # CSS variable tokens + reset
├── components/               # shared primitives (Button, Card, Stack, …)
├── lib/                      # flow registry, scenario context
├── ui/                       # meta-UI (flow index, landing, runner)
└── flows/
    └── example-checkout/     # copy this folder to make a new flow
```

See [AUTHORING.md](./AUTHORING.md) for how to create a new flow.

## Designer git workflow

Two Claude Code slash commands wrap all the git ceremony — you shouldn't
need to touch `git` directly:

| Command       | When to use                                 | What it does                                                    |
| ------------- | ------------------------------------------- | --------------------------------------------------------------- |
| `/new-flow`   | Starting a new flow or scenario             | Pulls main, creates `flow/<slug>` branch, scaffolds the folder  |
| `/ship-flow`  | Happy with your work and want it reviewed   | Commits, pushes to GitHub, opens a PR via `gh`                  |

Full details in [AUTHORING.md](./AUTHORING.md#git-flow-for-designers--new-flow-and-ship-flow).

## How it works

- **Flows live in `src/flows/<flow-id>/`** and are auto-discovered at build
  time via `import.meta.glob`. There's no registry to edit.
- **Each flow defines named scenarios** (e.g. `default`, `empty-cart`) in
  `scenarios.ts`. The selected scenario's `data` is provided to the flow via
  React context.
- **The active scenario is stored in the URL** (`?scenario=empty-cart`), so
  once a designer enters a flow no configuration UI is visible — the flow
  owns the whole screen.
- **Flow isolation is enforced by ESLint** — a flow may only import from its
  own folder, `@/components`, or `@/lib`. Cross-flow imports are blocked so
  flows can't accidentally depend on one another.

## Styling

The design system is a two-tier CSS variable setup inspired by perpay-web:

- `src/design/base-tokens.css` — primitives (colors, spacing, radii).
- `src/design/semantic-tokens.css` — semantic aliases that every
  `*.module.css` file references via `var(--semantic-*)`.

Never reference a `--base-*` token directly from a component; go through a
semantic alias so intent stays readable.

## Out of scope

No backend, no auth, no real API calls. Everything renders from the mock
scenarios in each flow. If a flow needs a "server", fake it with a
`setTimeout` and a scenario that toggles between loading/loaded/error states.
