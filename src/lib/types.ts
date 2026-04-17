import type { ComponentType } from 'react';

export type FlowMeta = {
  name: string;
  description: string;
};

export type Scenario<T = unknown> = {
  label: string;
  data: T;
};

export type ScenarioMap<T = unknown> = Record<string, Scenario<T>>;

export type Flow = {
  id: string;
  meta: FlowMeta;
  Component: ComponentType;
  scenarios: ScenarioMap;
};
