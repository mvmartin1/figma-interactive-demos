# Plan: `figma-interactive-demos` — interactive demo tool for designers

## Context

The repo is a single README. We're building it from scratch: a local-only React app that lets designers use Claude Code to turn Figma mockups into runnable, interactive flows — think "Storybook, but for full flows instead of isolated components."

**Goals**

- Zero backend. Everything runs off in-file mock data.
- Each flow is a **self-contained folder** under `src/flows/` with its own components, screens, mock scenarios, and internal routes.
- A **meta-UI** (flow index + scenario picker) is shown *outside* a flow. Once a flow is entered, no config UI is visible — the designer sees only the flow.
- Designers can define multiple **scenarios** per flow (e.g. `empty`, `loaded`, `error`) and switch between them from the flow's landing page.
- **Flow isolation**: a flow may only import from its own folder, shared primitives (`@/components`), or app utilities (`@/lib`). No flow-to-flow imports.

**Stack decisions (locked in with user)**

- **Vite + React 18 + TypeScript** — fast dev server, types help Claude Code author correct code; designers read but don't write TS.
- **React Router v6** + auto-discovery of `src/flows/*/` via `import.meta.glob` (gives "file-based routing" feel without Next.js overhead).
- **CSS Modules** co-located per component, with a **two-tier CSS variable token system** mirroring `perpay-web` (`base-tokens.css` primitives → `semantic-tokens.css` aliases). No build pipeline — hand-maintained `:root` vars.
- **Mock data**: per-flow `scenarios.ts` exporting named scenarios, selected on the flow's landing page, delivered to components via a `ScenarioContext`. Active scenario persisted in the URL (`?scenario=empty`) so no config chrome appears inside the flow.

## Project structure

```
figma-interactive-demos/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── .eslintrc.cjs              # enforces no cross-flow imports
├── README.md                  # how to run, how to add a flow
├── AUTHORING.md               # the flow contract + example walkthrough
└── src/
    ├── main.tsx               # Vite entry; imports global tokens + mounts App
    ├── App.tsx                # <BrowserRouter> + top-level routes
    ├── design/
    │   ├── base-tokens.css         # primitive CSS vars (colors, spacing, radii, fonts)
    │   ├── semantic-tokens.css     # semantic aliases referencing base vars
    │   ├── typography.css          # font-shorthand tokens
    │   └── reset.css               # minimal global reset
    ├── components/            # shared primitives (Button, Input, Card, Stack, Text)
    │   └── Button/Button.tsx + Button.module.css
    ├── lib/
    │   ├── flow-registry.ts        # auto-discovers flows via import.meta.glob
    │   ├── scenario-context.tsx    # Provider + useScenario() hook
    │   └── types.ts                # Flow, FlowMeta, Scenario<T>
    ├── ui/                    # meta-UI chrome (only visible OUTSIDE a flow)
    │   ├── FlowsIndex/             # home page, lists all flows
    │   ├── FlowLanding/            # per-flow intro + scenario picker
    │   └── ScenarioPicker/
    └── flows/
        └── example-checkout/       # seed example designers copy from
            ├── meta.ts                  # { name, description }
            ├── scenarios.ts             # named scenario objects
            ├── index.tsx                # defines this flow's internal <Routes>
            ├── screens/
            │   ├── Cart.tsx + .module.css
            │   ├── Review.tsx + .module.css
            │   └── Confirmation.tsx + .module.css
            └── components/              # flow-specific components
                └── LineItem.tsx + .module.css
```

## Routing model

| Route                       | Renders                     | Chrome visible?                     |
| --------------------------- | --------------------------- | ----------------------------------- |
| `/`                         | `FlowsIndex`                | Yes — lists every discovered flow  |
| `/flows/:flowId`            | `FlowLanding`               | Yes — description + scenario picker |
| `/flows/:flowId/run/*`      | Flow's own `<Routes>`       | **No** — flow owns the whole screen |

The scenario lives in the URL (`/flows/checkout/run?scenario=empty`) so switching = edit URL or go back to landing. Inside `run/*`, only the flow is rendered — no app chrome.

## Key utilities to build

**`src/lib/flow-registry.ts`** — auto-discovers flows:

```ts
const metaModules = import.meta.glob('../flows/*/meta.ts', { eager: true });
const flowModules = import.meta.glob('../flows/*/index.tsx', { eager: true });
const scenarioModules = import.meta.glob('../flows/*/scenarios.ts', { eager: true });

export const flows = Object.keys(metaModules).map((path) => {
  const id = path.split('/').slice(-2, -1)[0];
  return {
    id,
    meta: (metaModules[path] as any).default,
    Component: (flowModules[path.replace('meta.ts', 'index.tsx')] as any).default,
    scenarios: (scenarioModules[path.replace('meta.ts', 'scenarios.ts')] as any).scenarios,
  };
});
```

**`src/lib/scenario-context.tsx`** — provides the active scenario to all flow components:

```ts
export function useScenario<T = unknown>(): T {
  return useContext(ScenarioContext) as T;
}
```

`FlowRoute` reads `?scenario=` from the URL, looks it up in the flow's `scenarios.ts`, and wraps the flow's component in `<ScenarioProvider value={...}>`.

## Flow authoring contract

Each `src/flows/<flowId>/` folder **must** export:

- **`meta.ts`** — `export default { name: string; description: string; }`
- **`scenarios.ts`** — `export const scenarios = { default: {...}, empty: {...}, error: {...} }` — any object shape; one key must be `default`.
- **`index.tsx`** — a React component rendering the flow's internal `<Routes>`; reads data via `useScenario<T>()`.

## Isolation enforcement

`.eslintrc.cjs` configures `no-restricted-imports` to forbid any import path matching `**/flows/<other>/**` from within a flow folder. Flows may only import from:

- relative paths inside their own folder
- `@/components`, `@/lib`, `@/design`
- npm packages

## Styling convention (mirrored from perpay-web)

- `src/design/base-tokens.css`: ~20 primitives (colors, spacing scale, radii, font sizes).
- `src/design/semantic-tokens.css`: ~15 semantic aliases (`--color-surface-primary`, `--color-text-heading`, `--space-md`, etc.) → `var(--base-*)`.
- Every `*.module.css` file imports `semantic-tokens.css` at the top and references `var(--semantic-*)` only. Reference: `/Users/matthewmartin/CODE/perpay/perpay-web/packages/design/src/styles/semantic-tokens.module.css`.
- Component example reference: `/Users/matthewmartin/CODE/perpay/perpay-web/packages/components/src/design-system/Box/Box.tsx`.

Scaled way down from perpay-web — no Sass, no `composes:`, no icon system, no utility classes beyond what the seed example needs.

## Files to create (implementation checklist)

**Config & bootstrap (~10 files)**

- `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `.eslintrc.cjs`, `.gitignore`
- `src/main.tsx`, `src/App.tsx`
- `src/design/{base-tokens,semantic-tokens,typography,reset}.css`

**Shared primitives (~5 components)**

- `Button`, `Input`, `Card`, `Stack`, `Text` — each as `*.tsx` + `*.module.css`

**Lib**

- `src/lib/flow-registry.ts`, `src/lib/scenario-context.tsx`, `src/lib/types.ts`

**Meta-UI**

- `src/ui/FlowsIndex/` (home grid of flow cards)
- `src/ui/FlowLanding/` (flow description + scenario picker + "Start" button)
- `src/ui/ScenarioPicker/`

**Seed flow: `example-checkout`**

- `meta.ts`, `scenarios.ts` (scenarios: `default`, `empty-cart`, `promo-applied`)
- `index.tsx` with nested routes: `/` → Cart, `review` → Review, `confirmation` → Confirmation
- 3 screens + 1 flow-specific component (`LineItem`), each with its own `.module.css`

**Docs**

- `README.md`: install, run, scripts
- `AUTHORING.md`: the flow contract, the isolation rule, copy-the-example walkthrough

## Verification

1. `npm install && npm run dev` — dev server boots, no errors.
2. Navigate to `http://localhost:5173/` — `FlowsIndex` shows a card for **example-checkout**.
3. Click the card → `FlowLanding` shows the description + a scenario dropdown (`default`, `empty-cart`, `promo-applied`).
4. Pick `default` → click **Start** → lands on the flow's Cart screen, **no app chrome visible**.
5. Progress Cart → Review → Confirmation; mock data from the selected scenario is rendered.
6. Change URL to `?scenario=empty-cart` → Cart screen shows empty state.
7. Browser back to `FlowLanding` works cleanly.
8. `npm run build` produces a clean production bundle.
9. `npm run lint` passes; adding a test import from one flow to another trips the ESLint isolation rule.
10. Visual smoke: semantic tokens are actually applied (inspect element shows `var(--semantic-*)` in component styles).

## Out of scope (intentional)

- Authentication, API calls, Mock Service Worker.
- Light/dark theming (can be added later via `data-theme` on `<html>` once needed).
- Unit/E2E tests — this is a designer-authoring tool; manual verification above is sufficient at v0.
- Storybook — whole point is that we're *not* Storybook.
- Deploy pipeline — local-only by design.
