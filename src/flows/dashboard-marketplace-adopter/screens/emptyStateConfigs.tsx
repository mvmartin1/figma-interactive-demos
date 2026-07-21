import type { EmptyStateConfig } from './EmptyStatePage';
import cardGradient from '../assets/gradients/card.png';
import marketplaceGradient from '../assets/gradients/marketplace.png';
import cashGradient from '../assets/gradients/cash-v4.svg';
import billSplitterGradient from '../assets/gradients/billsplitter-v6.svg';
import savingsGradient from '../assets/gradients/savings.svg';

// ─── Small inline icon components for the benefit rows ────────────────

function CloudIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a5 5 0 0 1-1-9.9A7 7 0 0 1 21 12a4 4 0 0 1-3.5 7Z"/>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 17 9 11 13 15 21 7"/>
      <polyline points="14 7 21 7 21 14"/>
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
    </svg>
  );
}

function CashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M6 10h.01M18 14h.01"/>
    </svg>
  );
}

function PercentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19"/>
      <circle cx="6.5" cy="6.5" r="2.5"/>
      <circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="10" rx="2"/>
      <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
    </svg>
  );
}

function PiggyBankIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 7h-1a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v0a5 5 0 0 0 3 4.6V17a2 2 0 0 0 2 2h1v2h4v-2h1v-1"/>
      <circle cx="15" cy="10" r="0.5" fill="currentColor"/>
    </svg>
  );
}

// ─── Shared testimonials + featured logos (demo data) ──────────────────

const TESTIMONIALS = [
  {
    title: 'Best app ever...',
    body: 'This app did this for my life and help me get the credit that I need to purchase gas and groceries. It really helped my family during a time of need.',
    author: 'Justin A.',
  },
  {
    title: 'Best app ever...',
    body: 'This app did this for my life and help me get the credit that I need to purchase gas and groceries. It really helped my family during a time of need.',
    author: 'Justin A.',
  },
  {
    title: 'Best app ever...',
    body: 'This app did this for my life and help me get the credit that I need to purchase gas and groceries. It really helped my family during a time of need.',
    author: 'Justin A.',
  },
];

const FEATURED = ['Credit Karma', 'MoneyLion', 'Mastercard'];

// ─── Per-product configs ──────────────────────────────────────────────

export const cardEmptyState: EmptyStateConfig = {
  gradientImage: cardGradient,
  headline: {
    prefix: 'Get up to a $',
    tickerFrom: 1000,
    tickerTo: 1500,
    suffix: ' credit limit',
  },
  subhead: 'Apply in as little as 60 seconds without impacting your credit score',
  benefits: [
    { icon: <CloudIcon />, label: 'Build credit', sub: 'New credit line, built for positive repayment history' },
    { icon: <StarIcon />, label: 'Earn 2% rewards', sub: 'on every payment made' },
    { icon: <TrendUpIcon />, label: 'Increase your credit limit', sub: 'in as few as 3 months' },
  ],
  rating: { value: '4.9 / 5.0', source: 'On the Credit Karma app' },
  testimonials: TESTIMONIALS,
  featuredOn: FEATURED,
  ctaLabel: 'Apply now',
  ctaColor: 'black',
};

export const marketplaceEmptyState: EmptyStateConfig = {
  gradientImage: marketplaceGradient,
  headline: {
    prefix: 'Shop up to $',
    tickerFrom: 200,
    tickerTo: 1500,
    suffix: ' with easy pay',
  },
  subhead: 'Split any purchase into small direct-deposit payments — no interest, no fees.',
  benefits: [
    { icon: <ShoppingBagIcon />, label: 'Top brands', sub: 'Apple, Samsung, KitchenAid and more' },
    { icon: <CalendarIcon />, label: 'Pay over time', sub: 'Automatic payments from your paycheck' },
    { icon: <TrendUpIcon />, label: 'Build credit', sub: 'Every on-time payment reported to bureaus' },
  ],
  rating: { value: '4.8 / 5.0', source: 'On the App Store' },
  testimonials: TESTIMONIALS,
  featuredOn: FEATURED,
  ctaLabel: 'Start shopping',
};

export const cashAssistEmptyState: EmptyStateConfig = {
  gradientImage: cashGradient,
  headline: {
    prefix: 'Borrow up to $',
    tickerFrom: 100,
    tickerTo: 500,
    suffix: ' in cash',
  },
  subhead: 'Get cash sent to your bank account and repay from your next paycheck.',
  benefits: [
    { icon: <CashIcon />, label: 'Cash when you need it', sub: 'Same-day deposit to your bank' },
    { icon: <PercentIcon />, label: '0% interest', sub: 'No fees, ever — just a flat repayment' },
    { icon: <CalendarIcon />, label: 'Repay automatically', sub: 'Split into small direct-deposit payments' },
  ],
  rating: { value: '4.7 / 5.0', source: 'On Trustpilot' },
  testimonials: TESTIMONIALS,
  featuredOn: FEATURED,
  ctaLabel: 'Apply for Cash Assist',
};

export const billSplitterEmptyState: EmptyStateConfig = {
  gradientImage: billSplitterGradient,
  headline: {
    prefix: 'Split up to ',
    tickerFrom: 0,
    tickerTo: 100,
    suffix: '% of your bills',
    format: 'plain',
  },
  subhead: 'Turn any bill into automatic payments from your paycheck. Never miss a due date again.',
  benefits: [
    { icon: <UsersIcon />, label: 'Any biller', sub: 'Rent, utilities, subscriptions, and more' },
    { icon: <CalendarIcon />, label: 'Automatic payments', sub: 'Paid straight from your direct deposit' },
    { icon: <LockIcon />, label: 'On-time, every time', sub: 'Skip late fees and protect your credit' },
  ],
  rating: { value: '4.6 / 5.0', source: 'On the App Store' },
  testimonials: TESTIMONIALS,
  featuredOn: FEATURED,
  ctaLabel: 'Start Bill Splitter',
};

export const savingsEmptyState: EmptyStateConfig = {
  gradientImage: savingsGradient,
  headline: {
    prefix: 'Save up to $',
    tickerFrom: 50,
    tickerTo: 1000,
    suffix: ' per paycheck',
  },
  subhead: 'Set aside a little from every paycheck. Watch your savings grow automatically.',
  benefits: [
    { icon: <PiggyBankIcon />, label: 'Auto-save', sub: 'A slice of every paycheck, on autopilot' },
    { icon: <TrendUpIcon />, label: 'Earn on your balance', sub: 'Competitive rates, compounded daily' },
    { icon: <LockIcon />, label: 'FDIC insured', sub: 'Up to $250,000 protection' },
  ],
  rating: { value: '4.8 / 5.0', source: 'On Bankrate' },
  testimonials: TESTIMONIALS,
  featuredOn: FEATURED,
  ctaLabel: 'Start saving',
};
