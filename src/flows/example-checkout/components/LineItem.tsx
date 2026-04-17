import Text from '@/components/Text/Text';
import styles from './LineItem.module.css';

type Props = {
  title: string;
  price: number;
  qty: number;
};

export default function LineItem({ title, price, qty }: Props) {
  return (
    <div className={styles.row}>
      <div className={styles.details}>
        <Text>{title}</Text>
        <Text variant="label" muted>
          Qty {qty} · ${price.toFixed(2)} each
        </Text>
      </div>
      <Text>${(price * qty).toFixed(2)}</Text>
    </div>
  );
}
