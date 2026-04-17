import type { ComponentType } from 'react';
import type { Flow, FlowMeta, ScenarioMap } from './types';

const metaModules = import.meta.glob('../flows/*/meta.ts', {
  eager: true,
}) as Record<string, { default: FlowMeta }>;

const flowModules = import.meta.glob('../flows/*/index.tsx', {
  eager: true,
}) as Record<string, { default: ComponentType }>;

const scenarioModules = import.meta.glob('../flows/*/scenarios.ts', {
  eager: true,
}) as Record<string, { scenarios: ScenarioMap }>;

function flowIdFromPath(path: string): string {
  const match = path.match(/\/flows\/([^/]+)\//);
  if (!match) throw new Error(`Unable to parse flow id from ${path}`);
  return match[1];
}

export const flows: Flow[] = Object.keys(metaModules)
  .map((metaPath) => {
    const id = flowIdFromPath(metaPath);
    const indexPath = metaPath.replace('meta.ts', 'index.tsx');
    const scenariosPath = metaPath.replace('meta.ts', 'scenarios.ts');

    const flowModule = flowModules[indexPath];
    const scenariosModule = scenarioModules[scenariosPath];

    if (!flowModule) {
      throw new Error(`Flow "${id}" is missing index.tsx`);
    }
    if (!scenariosModule) {
      throw new Error(`Flow "${id}" is missing scenarios.ts`);
    }
    if (!scenariosModule.scenarios.default) {
      throw new Error(`Flow "${id}" must define a "default" scenario`);
    }

    return {
      id,
      meta: metaModules[metaPath].default,
      Component: flowModule.default,
      scenarios: scenariosModule.scenarios,
    };
  })
  .sort((a, b) => a.meta.name.localeCompare(b.meta.name));

export function getFlow(id: string): Flow | undefined {
  return flows.find((f) => f.id === id);
}
