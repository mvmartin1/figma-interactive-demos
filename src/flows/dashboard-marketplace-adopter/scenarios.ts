import type { Scenario } from '@/lib/types';

export type DashboardData = {
  user: {
    initials: string;
    cartCount: number;
  };
  spending: {
    marketplaceAvailable: number;
    spendingLimit: number;
    currentBalance: number;
    totalLimit: number;
  };
  order: {
    status: string;
    arrivalDays: number;
    orderNumber: string;
  };
  checkout: {
    itemCount: number;
    stepsLeft: number;
    expiresInDays: number;
  };
  payments: {
    nextPaycheckAmount: number;
  };
  creditBuilding: {
    paymentHistoryPercent: number;
    accountAgeYears: number;
    accountAgeMonths: number;
  };
  card: {
    adopted: boolean;
    creditLimit: number;
    currentBalance: number;
  };
  hasOrder: boolean;
};

const BASE_DATA = {
  user: { initials: 'JD', cartCount: 1 },
  spending: {
    marketplaceAvailable: 523,
    spendingLimit: 137.49,
    currentBalance: 400,
    totalLimit: 800,
  },
  order: {
    status: 'In transit',
    arrivalDays: 7,
    orderNumber: '23234234',
  },
  checkout: {
    itemCount: 3,
    stepsLeft: 1,
    expiresInDays: 3,
  },
  payments: {
    nextPaycheckAmount: 22.0,
  },
  creditBuilding: {
    paymentHistoryPercent: 100,
    accountAgeYears: 1,
    accountAgeMonths: 5,
  },
};

export const scenarios: Record<string, Scenario<DashboardData>> = {
  default: {
    label: 'Marketplace First – Order Shipped',
    data: {
      ...BASE_DATA,
      card: { adopted: false, creditLimit: 1500, currentBalance: 0 },
      hasOrder: true,
    },
  },
  marketplaceNoOrder: {
    label: 'Marketplace First – No Order Yet',
    data: {
      ...BASE_DATA,
      card: { adopted: false, creditLimit: 1500, currentBalance: 0 },
      hasOrder: false,
    },
  },
  cardAdopter: {
    label: 'Marketplace First, Card Adopter',
    data: {
      ...BASE_DATA,
      card: { adopted: true, creditLimit: 1500, currentBalance: 0 },
      hasOrder: true,
    },
  },
};
