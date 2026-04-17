import { Link } from 'react-router-dom';
import { flows } from '@/lib/flow-registry';
import Card from '@/components/Card/Card';
import Stack from '@/components/Stack/Stack';
import Text from '@/components/Text/Text';
import styles from './FlowsIndex.module.css';

export default function FlowsIndex() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Text as="h1" variant="heading-lg">
          Interactive Demos
        </Text>
        <Text muted>
          Click a demo to see its scenarios and start the flow.
        </Text>
      </header>
      {flows.length === 0 ? (
        <Card>
          <Stack gap="sm">
            <Text as="h2" variant="heading-sm">
              No flows yet
            </Text>
            <Text muted>
              Add one under <code>src/flows/&lt;flow-id&gt;/</code>. See
              AUTHORING.md for the contract.
            </Text>
          </Stack>
        </Card>
      ) : (
        <div className={styles.grid}>
          {flows.map((flow) => (
            <Link
              key={flow.id}
              to={`/flows/${flow.id}`}
              className={styles.cardLink}
            >
              <Card>
                <Stack gap="sm">
                  <Text as="h2" variant="heading-sm">
                    {flow.meta.name}
                  </Text>
                  <Text muted>{flow.meta.description}</Text>
                  <Text variant="label" muted className={styles.meta}>
                    {Object.keys(flow.scenarios).length} scenario
                    {Object.keys(flow.scenarios).length === 1 ? '' : 's'}
                  </Text>
                </Stack>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
