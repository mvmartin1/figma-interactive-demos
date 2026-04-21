# Authoring a flow

A flow is a self-contained folder under `src/flows/<flow-id>/` that renders a
prototype experience. Designers use Claude Code to create them from Figma
mockups; Claude only needs to follow the contract below.

## Quickstart

Copy `src/flows/example-checkout/` to `src/flows/<your-flow-id>/` and edit.
That's it — the flow appears on the home page on save.

## The contract

Every flow folder **must** export three things:

### 1. `meta.ts`

```ts
import type { FlowMeta } from '@/lib/types';

const meta: FlowMeta = {
  name: 'Onboarding',
  description: 'New-user signup and first-run tour.',
};

export default meta;
```

### 2. `scenarios.ts`

Named scenarios are the whole point — each scenario is a preset of mock data
the designer can demo. Always include a scenario named `default`.

```ts
import type { Scenario } from '@/lib/types';

export type OnboardingData = {
  user: { email: string };
  step: 'welcome' | 'profile' | 'done';
};

export const scenarios: Record<string, Scenario<OnboardingData>> = {
  default: {
    label: 'New user, first visit',
    data: { user: { email: '' }, step: 'welcome' },
  },
  'mid-flow': {
    label: 'Resuming at profile step',
    data: { user: { email: 'sam@example.com' }, step: 'profile' },
  },
};
```

### 3. `index.tsx`

The default-exported component renders this flow's internal routes (if any).
Read scenario data via `useScenario<YourData>()`. Use `useFlowNavigate` for
navigation — it preserves the `?scenario=` query param automatically.

```tsx
import { Routes, Route } from 'react-router-dom';
import Welcome from './screens/Welcome';
import Profile from './screens/Profile';
import Done from './screens/Done';

export default function OnboardingFlow() {
  return (
    <Routes>
      <Route index element={<Welcome />} />
      <Route path="profile" element={<Profile />} />
      <Route path="done" element={<Done />} />
    </Routes>
  );
}
```

Inside a screen:

```tsx
import { useScenario, useFlowNavigate } from '@/lib/scenario-context';
import type { OnboardingData } from '../scenarios';

export default function Welcome() {
  const data = useScenario<OnboardingData>();
  const navigate = useFlowNavigate();
  return <button onClick={() => navigate('profile')}>Continue</button>;
}
```

## Rules

- **Flows must not import from other flows.** Share code via `@/components`
  (shared primitives) or `@/lib` (hooks/utilities). ESLint will fail the
  build if you cross the line.
- **No backend calls.** Mock any async work with `setTimeout` and scenarios
  like `loading` / `loaded` / `error`.
- **Stay inside the design system.** Reference semantic tokens in your
  `*.module.css` files (e.g. `var(--semantic-space-md)`), not raw hex or
  pixel values from Figma output.
- **Keep scenario data JSON-serialisable.** Plain objects, arrays, strings,
  numbers, booleans. No class instances or functions.
- **Mobile-first, fully responsive.** Even when the Figma source is on phone
  frames, the flow should be a real responsive web UI — **do not wrap flows
  in fixed-width device chrome.** Start with a single-column mobile layout.
  Give pages a readable `max-width` (typically 640–960px) and center with
  `margin: 0 auto`.
- **One breakpoint, by default: `--small-screen` (480px).** This matches
  modern perpay-web — across ~1,100 `@media` usages in perpay-web, 900+ hit
  `--small-screen`; the rest are reserved for special cases. Treat it as the
  single "mobile → not-mobile" switch:

  ```css
  .layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--semantic-space-md);
  }
  @media (--small-screen) {
    .layout {
      grid-template-columns: 1fr 1fr;
    }
    /* bigger padding / roomier gaps usually land here too */
  }
  ```

  Only reach for `--medium-screen` (768px) or larger when 480px is visibly
  too tight for a specific layout change (e.g. a component that needs more
  horizontal room before switching to a side-by-side). Don't sprinkle
  multiple breakpoints across a flow "just in case".
- **Only use `min-width` queries.** `max-width` queries break the
  mobile-first paradigm and are deprecated in perpay-web too.
- **Reference names, not pixel values.** The full scale (defined in
  `src/design/breakpoints.css`, mirrored from perpay-web's
  `custom-media.css`):

  | Name                  | Min width | When to use                         |
  | --------------------- | --------- | ----------------------------------- |
  | `--small-screen`      | 480px     | Default mobile-vs-desktop split     |
  | `--medium-screen`     | 768px     | When 480px can't fit a layout shift |
  | `--semi-large-screen` | 992px     | Rare — desktop-specific adjustments |
  | `--large-screen`      | 1120px    | Rare                                |
  | `--jumbo-screen`      | 1170px    | Very rare                           |

  `@csstools/postcss-global-data` injects these into every CSS Module, so no
  per-file imports are needed.

## Conventions

- Co-locate CSS Modules next to components: `Foo.tsx` + `Foo.module.css`.
- Put flow-specific components under `<flow>/components/`, screens under
  `<flow>/screens/`.
- `useFlowNavigate` accepts relative paths that resolve against the URL
  (e.g. from `/run/review`, `navigate('..')` → `/run`, and
  `navigate('../confirmation')` → `/run/confirmation`).

## Working with Claude Code + Figma

A typical designer prompt in this repo:

> "Using the Figma MCP server, read node `12:34` from this file and create a
> new flow at `src/flows/account-recovery/` following AUTHORING.md. Include
> scenarios for happy path, expired link, and rate-limited."

Claude will:

1. Pull the design context (`get_design_context`) and screenshot from Figma.
2. Scaffold the folder by copying the example flow's shape.
3. Map Figma tokens to `--semantic-*` variables where possible.
4. Wire up scenarios and internal routes per this doc.

## Git flow for designers — `/new-flow` and `/ship-flow`

Two slash commands wrap all the git ceremony so you don't have to touch it.

### Starting a new session

Type `/new-flow` in Claude Code when you want to begin a new flow or
scenario. It will:

- Stash or commit anything you have in progress (asking first).
- Pull the latest `main`.
- Create a feature branch named `flow/<your-slug>`.
- Offer to scaffold a new flow folder from `src/flows/example-checkout/`.

You stay on that branch for the whole session. Keep editing files; no need
to run git commands yourself.

### Finishing a session

Type `/ship-flow` when you're happy and want your work reviewed. It will:

- Commit any pending changes (showing you the message first).
- Push your branch to GitHub.
- Open a pull request via the `gh` CLI, pre-filled with the flow's name,
  description, and scenario list.
- Hand you back the PR URL.

If you come back later and change more things, `/ship-flow` again — it'll
commit + push and update the same PR.

### When things go sideways

Neither command will force-push, reset your work, or skip safety checks
without asking you first. If something looks unusual (diverged history,
unexpected files staged), the skill stops and tells you. Ask for help
rather than answering "yes" to something you don't fully understand.
