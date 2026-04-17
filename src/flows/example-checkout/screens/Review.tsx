import { useScenario, useFlowNavigate } from '@/lib/scenario-context';
import Button from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import Stack from '@/components/Stack/Stack';
import Text from '@/components/Text/Text';
import type { CheckoutData } from '../scenarios';
import styles from './Review.module.css';

export default function Review() {
  const data = useScenario<CheckoutData>();
  const navigate = useFlowNavigate();

  return (
    <div className={styles.page}>
      <Stack gap="lg">
        <Text as="h1" variant="heading-md">
          Review & confirm
        </Text>

        <Card>
          <Stack gap="lg">
            <Stack gap="xs">
              <Text variant="label" muted>
                Customer
              </Text>
              <Text>{data.customer.name}</Text>
              <Text muted>{data.customer.email}</Text>
            </Stack>

            <Stack gap="xs">
              <Text variant="label" muted>
                Items
              </Text>
              {data.items.map((i) => (
                <Text key={i.id}>
                  {i.qty}× {i.title}
                </Text>
              ))}
            </Stack>

            {data.promo && (
              <Stack gap="xs">
                <Text variant="label" muted>
                  Promo
                </Text>
                <Text>
                  {data.promo.code} (−${data.promo.amountOff.toFixed(2)})
                </Text>
              </Stack>
            )}
          </Stack>
        </Card>

        <Stack gap="sm" direction="horizontal">
          <Button variant="secondary" onClick={() => navigate('..')}>
            Back
          </Button>
          <Button onClick={() => navigate('../confirmation')}>
            Place order
          </Button>
        </Stack>
      </Stack>
    </div>
  );
}
