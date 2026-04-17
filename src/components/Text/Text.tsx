import type { ElementType, ReactNode } from 'react';
import styles from './Text.module.css';

type Variant = 'body' | 'label' | 'heading-sm' | 'heading-md' | 'heading-lg';

type Props = {
  children: ReactNode;
  as?: ElementType;
  variant?: Variant;
  muted?: boolean;
  className?: string;
};

export default function Text({
  children,
  as: Tag = 'p',
  variant = 'body',
  muted,
  className = '',
}: Props) {
  const classes = [
    styles.text,
    styles[`variant-${variant}`],
    muted && styles.muted,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <Tag className={classes}>{children}</Tag>;
}
