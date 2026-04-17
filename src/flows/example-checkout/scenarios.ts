import type { Scenario } from '@/lib/types';

export type CheckoutData = {
  customer: { name: string; email: string };
  items: Array<{ id: string; title: string; price: number; qty: number }>;
  promo?: { code: string; amountOff: number };
};

export const scenarios: Record<string, Scenario<CheckoutData>> = {
  default: {
    label: 'Standard cart (3 items)',
    data: {
      customer: { name: 'Jordan Rivera', email: 'jordan@example.com' },
      items: [
        { id: 'a', title: 'Wireless headphones', price: 129.99, qty: 1 },
        { id: 'b', title: 'USB-C cable (3 m)', price: 12.0, qty: 2 },
        { id: 'c', title: 'Laptop stand', price: 49.5, qty: 1 },
      ],
    },
  },
  'empty-cart': {
    label: 'Empty cart',
    data: {
      customer: { name: 'Jordan Rivera', email: 'jordan@example.com' },
      items: [],
    },
  },
  'promo-applied': {
    label: 'Promo code applied',
    data: {
      customer: { name: 'Jordan Rivera', email: 'jordan@example.com' },
      items: [
        { id: 'a', title: 'Wireless headphones', price: 129.99, qty: 1 },
      ],
      promo: { code: 'WELCOME10', amountOff: 13.0 },
    },
  },
};
