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
