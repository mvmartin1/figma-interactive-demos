import { Link } from 'react-router-dom';
import { useScenario } from '@/lib/scenario-context';
import Card from '@/components/Card/Card';
import Stack from '@/components/Stack/Stack';
import Text from '@/components/Text/Text';
import type { CheckoutData } from '../scenarios';
import styles from './Confirmation.module.css';

export default function Confirmation() {
  const data = useScenario<CheckoutData>();
  const firstName = data.customer.name.split(' ')[0];

  return (
    <div className={styles.page}>
      <Card>
        <Stack gap="md">
          <Text as="h1" variant="heading-md">
            Order confirmed
          </Text>
          <Text>
            Thanks, {firstName}! A confirmation is on its way to{' '}
            {data.customer.email}.
          </Text>
          <Link to="/" className={styles.home}>
            ← Back to demos
          </Link>
        </Stack>
      </Card>
    </div>
  );
}
