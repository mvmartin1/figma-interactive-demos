import { useScenario, useFlowNavigate } from '@/lib/scenario-context';
import Button from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import Stack from '@/components/Stack/Stack';
import Text from '@/components/Text/Text';
import LineItem from '../components/LineItem';
import type { CheckoutData } from '../scenarios';
import styles from './Cart.module.css';

export default function Cart() {
  const data = useScenario<CheckoutData>();
  const navigate = useFlowNavigate();

  const subtotal = data.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const total = subtotal - (data.promo?.amountOff ?? 0);

  return (
    <div className={styles.page}>
      <Stack gap="lg">
        <Text as="h1" variant="heading-md">
          Your cart
        </Text>

        {data.items.length === 0 ? (
          <Card>
            <Stack gap="sm">
              <Text as="h2" variant="heading-sm">
                Your cart is empty
              </Text>
              <Text muted>Add something to see it here.</Text>
            </Stack>
          </Card>
        ) : (
          <Card>
            <Stack gap="md">
              {data.items.map((item) => (
                <LineItem
                  key={item.id}
                  title={item.title}
                  price={item.price}
                  qty={item.qty}
                />
              ))}
              <div className={styles.divider} />
              <div className={styles.row}>
                <Text muted>Subtotal</Text>
                <Text>${subtotal.toFixed(2)}</Text>
              </div>
              {data.promo && (
                <div className={styles.row}>
                  <Text muted>Promo ({data.promo.code})</Text>
                  <Text muted>−${data.promo.amountOff.toFixed(2)}</Text>
                </div>
              )}
              <div className={styles.row}>
                <Text variant="heading-sm" as="span">
                  Total
                </Text>
                <Text variant="heading-sm" as="span">
                  ${total.toFixed(2)}
                </Text>
              </div>
            </Stack>
          </Card>
        )}

        {data.items.length > 0 && (
          <Button onClick={() => navigate('review')}>Review order</Button>
        )}
      </Stack>
    </div>
  );
}
