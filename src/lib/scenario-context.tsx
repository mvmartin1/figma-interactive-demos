import { createContext, useContext, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ScenarioContext = createContext<unknown>(null);

export function ScenarioProvider({
  value,
  children,
}: {
  value: unknown;
  children: ReactNode;
}) {
  return (
    <ScenarioContext.Provider value={value}>{children}</ScenarioContext.Provider>
  );
}

/**
 * Reads the active scenario's `data` from context.
 * Cast by the caller: `const data = useScenario<CheckoutData>()`.
 */
export function useScenario<T = unknown>(): T {
  const value = useContext(ScenarioContext);
  if (value === null) {
    throw new Error(
      'useScenario must be used inside a flow rendered by FlowRunner'
    );
  }
  return value as T;
}

/**
 * Navigate inside a flow while preserving the ?scenario= query param.
 * Use instead of react-router's `useNavigate` within flow code.
 *
 * Relative paths resolve against the URL (not the route tree) so a screen at
 * `/foo/bar/review` can call `navigate('..')` to get to `/foo/bar` predictably.
 */
export function useFlowNavigate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  return (to: string, options?: { replace?: boolean }) => {
    const qs = searchParams.toString();
    const [path, existing] = to.split('?');
    const merged = [existing, qs].filter(Boolean).join('&');
    navigate(merged ? `${path}?${merged}` : path, {
      ...options,
      relative: 'path',
    });
  };
}
