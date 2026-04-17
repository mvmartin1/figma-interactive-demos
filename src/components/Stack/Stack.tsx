import type { ReactNode } from 'react';
import styles from './Stack.module.css';

type Gap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type Direction = 'vertical' | 'horizontal';

type Props = {
  children: ReactNode;
  gap?: Gap;
  direction?: Direction;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
  className?: string;
};

export default function Stack({
  children,
  gap = 'md',
  direction = 'vertical',
  align,
  justify,
  wrap = false,
  className = '',
}: Props) {
  const classes = [
    styles.stack,
    styles[direction],
    styles[`gap-${gap}`],
    align && styles[`align-${align}`],
    justify && styles[`justify-${justify}`],
    wrap && styles.wrap,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <div className={classes}>{children}</div>;
}
