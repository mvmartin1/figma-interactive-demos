import { Link } from 'react-router-dom';
import Card from '@/components/Card/Card';
import Stack from '@/components/Stack/Stack';
import Text from '@/components/Text/Text';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <Card>
        <Stack gap="md">
          <Text as="h1" variant="heading-md">
            Not found
          </Text>
          <Text muted>That page doesn’t exist.</Text>
          <Link to="/">← Back to demos</Link>
        </Stack>
      </Card>
    </div>
  );
}
