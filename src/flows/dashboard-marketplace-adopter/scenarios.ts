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
    isOverlimit?: boolean;
    isReshipping?: boolean;
  };
  hasOrder: boolean;
  hasTracking: boolean;
  // ── Gradient Test scenario fields ──────────────────────────────────────
  // When true, every active-product page (Marketplace / Card / Cash Assist /
  // Bill Splitter) renders a shared template + per-tab gradient image so
  // swiping has no layout shift between tabs.
  gradientTest?: boolean;
  // 1 = single SVG/PNG gradient per page (test 1)
  // 2 = layered linear + ellipse glows for Cash Assist / Bill Splitter (test 2)
  gradientTestVersion?: 1 | 2;
  cashAssist?: { amount: number; balance: number };
  billSplitter?: { percentCovered: number; balance: number };
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
      hasTracking: true,
    },
  },
  marketplaceNoOrder: {
    label: 'Marketplace First – No Order Yet',
    data: {
      ...BASE_DATA,
      card: { adopted: false, creditLimit: 1500, currentBalance: 0 },
      hasOrder: false,
      hasTracking: true,
    },
  },
  cardAdopter: {
    label: 'Marketplace First, Card Adopter',
    data: {
      ...BASE_DATA,
      card: { adopted: true, creditLimit: 1500, currentBalance: 0 },
      hasOrder: true,
      hasTracking: true,
    },
  },
  cardAdopterNoTracking: {
    label: 'Marketplace + Card Adopter – No Tracking',
    data: {
      ...BASE_DATA,
      card: { adopted: true, creditLimit: 1500, currentBalance: 0 },
      hasOrder: true,
      hasTracking: false,
    },
  },
  cardOverlimitReship: {
    label: 'Card – Overlimit + Card Reshipping',
    data: {
      ...BASE_DATA,
      card: {
        adopted: true,
        creditLimit: 1000,
        currentBalance: 32,
        isOverlimit: true,
        isReshipping: true,
      },
      hasOrder: false,
      hasTracking: true,
    },
  },
  allActiveGradientTest1: {
    label: 'All Active Products – Gradient Test 1',
    data: {
      ...BASE_DATA,
      card: { adopted: true, creditLimit: 1500, currentBalance: 0 },
      hasOrder: true,
      hasTracking: true,
      gradientTest: true,
      cashAssist: { amount: 534, balance: 0 },
      billSplitter: { percentCovered: 100, balance: 0 },
    },
  },
  allActiveGradientTest2: {
    label: 'All Active Products – Gradient Test 2',
    data: {
      ...BASE_DATA,
      card: { adopted: true, creditLimit: 1500, currentBalance: 0 },
      hasOrder: true,
      hasTracking: true,
      gradientTest: true,
      gradientTestVersion: 2,
      cashAssist: { amount: 534, balance: 0 },
      billSplitter: { percentCovered: 100, balance: 0 },
    },
  },
};
