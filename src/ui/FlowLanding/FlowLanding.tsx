import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { getFlow } from '@/lib/flow-registry';
import Button from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import Stack from '@/components/Stack/Stack';
import Text from '@/components/Text/Text';
import ScenarioPicker from '../ScenarioPicker/ScenarioPicker';
import styles from './FlowLanding.module.css';

export default function FlowLanding() {
  const { flowId } = useParams<{ flowId: string }>();
  const navigate = useNavigate();
  const flow = flowId ? getFlow(flowId) : undefined;
  const [selectedScenario, setSelectedScenario] = useState<string>('default');

  if (!flow) {
    return <Navigate to="/" replace />;
  }

  const start = () => {
    navigate(`/flows/${flow.id}/run?scenario=${selectedScenario}`);
  };

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.back}>
        ← All demos
      </Link>
      <Card>
        <Stack gap="lg">
          <Stack gap="sm">
            <Text as="h1" variant="heading-md">
              {flow.meta.name}
            </Text>
            <Text muted>{flow.meta.description}</Text>
          </Stack>
          <ScenarioPicker
            scenarios={flow.scenarios}
            value={selectedScenario}
            onChange={setSelectedScenario}
          />
          <div>
            <Button onClick={start}>Start demo</Button>
          </div>
        </Stack>
      </Card>
    </div>
  );
}
