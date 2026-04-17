import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { getFlow } from '@/lib/flow-registry';
import { ScenarioProvider } from '@/lib/scenario-context';

/**
 * Renders a flow with its scenario's data in context. Deliberately has zero
 * visible chrome — the flow owns the whole screen.
 */
export default function FlowRunner() {
  const { flowId } = useParams<{ flowId: string }>();
  const [searchParams] = useSearchParams();

  if (!flowId) return <Navigate to="/" replace />;

  const flow = getFlow(flowId);
  if (!flow) return <Navigate to="/" replace />;

  const scenarioKey = searchParams.get('scenario') ?? 'default';
  const scenario = flow.scenarios[scenarioKey] ?? flow.scenarios.default;

  const FlowComponent = flow.Component;

  return (
    <ScenarioProvider value={scenario.data}>
      <FlowComponent />
    </ScenarioProvider>
  );
}
