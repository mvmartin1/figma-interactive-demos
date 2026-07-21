import { useState, useRef, useEffect, useCallback } from 'react';
import { useScenario } from '@/lib/scenario-context';
import type { DashboardData } from '../scenarios';
import styles from './Dashboard.module.css';
import EmptyStatePage from './EmptyStatePage';
import {
  cardEmptyState,
  marketplaceEmptyState,
  cashAssistEmptyState,
  billSplitterEmptyState,
  savingsEmptyState,
} from './emptyStateConfigs';
import marketplacePromoImg from '../assets/marketplace-promo.png';
import creditCardPromoImg from '../assets/credit-card-promo.png';
import smallCardImg from '../assets/small-card.png';
import hourglassImg from '../assets/hourglass-icon.svg';
import bellLightImg from '../assets/bell-light.svg';
import bellDarkImg from '../assets/bell-dark.svg';
import cartLightImg from '../assets/cart-light.svg';
import cartDarkImg from '../assets/cart-dark.svg';
import chipDotLightImg from '../assets/chip-dot-light.svg';
import chipDotDarkImg from '../assets/chip-dot-dark.svg';
import mpIconImg from '../assets/mp-icon.svg';
import otThumbImg from '../assets/ot-thumb.png';
import overlimitWarningImg from '../assets/overlimit-warning.svg';

const A = {
  bellLight: bellLightImg,
  bellDark: bellDarkImg,
  cartLight: cartLightImg,
  cartDark: cartDarkImg,
  chipDotLight: chipDotLightImg,
  chipDotDark: chipDotDarkImg,
  mpIcon: mpIconImg,
  otProductThumb: otThumbImg,
  overlimitWarningIcon: overlimitWarningImg,
};

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function ChevronRight({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M7.5 4.5L12 9L7.5 13.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChevronLeft({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M15 18L9 12L15 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ArrowRight({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M3.75 9H14.25M10.5 5.25L14.25 9L10.5 12.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="#2e71ea" strokeWidth="1.5"/>
      <path d="M10 6.5V10.5L12.5 12" stroke="#2e71ea" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function HourglassIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5.5 3H14.5M5.5 17H14.5" stroke="#2e71ea" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 3C6 3 6.5 7.5 10 10C13.5 12.5 14 17 14 17" stroke="#2e71ea" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 3C14 3 13.5 7.5 10 10C6.5 12.5 6 17 6 17" stroke="#2e71ea" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function HomeLineIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15.5V16H8.5V21H4C3.44772 21 3 20.5523 3 20V10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

function HandbagLineIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M6 2L3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function CalendarCheckLineIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 2V4M16 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 14.5L11 16.5L15 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChartLineIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 20H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 16L9 10L13 14L18 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 7H19V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CheckLineIcon({ size = 22, color = '#2e71ea' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12L10 17L19 7" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Credit Building empty state graph ───────────────────────────────────────

function CreditBuildingGraph() {
  return (
    <svg viewBox="0 0 311 155" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <g clipPath="url(#cbClip)">
        <line y1="67.601" x2="282" y2="67.601" stroke="#F1F3F5"/>
        <line y1="111.101" x2="282" y2="111.101" stroke="#F1F3F5"/>
        <line y1="154.601" x2="282" y2="154.601" stroke="#F1F3F5"/>
        <rect x="291" y="63.101" width="20" height="7" rx="3.5" fill="#F1F3F5"/>
        <rect x="291" y="107.101" width="20" height="7" rx="3.5" fill="#F1F3F5"/>
        <rect x="291" y="148.101" width="20" height="7" rx="3.5" fill="#F1F3F5"/>
        <path d="M21 128.101C12.976 128.302 8.177 127.967 5.087 127.791C1.958 127.612 0 130.112 0 133.246L0 152.601C0 153.706 0.895 154.601 2 154.601H281C282.105 154.601 283 153.706 283 152.601V59.65C283 57.838 280.693 56.877 279.263 57.99C258.752 73.958 215.805 71.58 198 73.101C179.026 74.722 127.436 105.131 117 106.101C97.077 107.954 87.795 120.521 65.5 132.101C49.392 140.468 39.501 127.638 21 128.101Z" fill="#E9EEF5"/>
        <circle cx="282" cy="57.101" r="6" fill="#BAC7D7"/>
        <circle cx="282" cy="57.101" r="8" stroke="white" strokeOpacity="0.81" strokeWidth="4"/>
        <g filter="url(#cbFilter)">
          <path d="M192 12.101C192 5.474 197.373 0.101 204 0.101L271 0.101C277.627 0.101 283 5.474 283 12.101V44.101H204C197.373 44.101 192 38.728 192 32.101V12.101Z" fill="white"/>
          <path d="M204 0.601H271C277.351 0.601 282.5 5.75 282.5 12.101V43.601H204C197.649 43.601 192.5 38.452 192.5 32.101V12.101C192.5 5.75 197.649 0.601 204 0.601Z" stroke="#D9E1EB"/>
        </g>
        <path d="M262 30.624L265.849 27.016L268.576 29.401L271.643 26.334" stroke="#049B82" strokeWidth="1.601" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M269.582 25.101H272.864C272.937 25.101 272.995 25.164 272.988 25.237L272.687 28.519" stroke="#049B82" strokeWidth="1.554" strokeLinecap="round"/>
        <rect x="262" y="14.101" width="10" height="7" rx="3.5" fill="#F1F5F8"/>
        <rect x="201" y="12.101" width="54" height="20" rx="4" fill="#F1F5F8"/>
      </g>
      <defs>
        <filter id="cbFilter" x="161.6" y="-20.799" width="151.8" height="104.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="9.5"/>
          <feGaussianBlur stdDeviation="15.2"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.906 0 0 0 0 0.922 0 0 0 0 0.933 0 0 0 0.5 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        <clipPath id="cbClip">
          <rect width="311" height="155" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

const CHIPS = [
  { key: 'all', label: 'All' },
  { key: 'marketplace', label: 'Marketplace' },
  { key: 'card', label: 'Card' },
  { key: 'cash', label: 'Cash Assist' },
  { key: 'billpay', label: 'Bill Splitter' },
  { key: 'savings', label: 'Savings' },
] as const;
const PAGE_COUNT = CHIPS.length;

type NotifColor = 'blue' | 'yellow' | 'red';
type ChipNotifs = Partial<Record<string, NotifColor>>;

const NOTIF_DOT_COLORS: Record<NotifColor, string> = {
  blue: '#2e71ea',
  yellow: '#EBB323',
  red: '#D93025',
};

function getChipNotifs(data: DashboardData): ChipNotifs {
  const n: ChipNotifs = {};
  if (data.hasOrder && data.hasTracking) n['marketplace'] = 'blue';
  if (data.card.isOverlimit) n['card'] = 'yellow';
  return n;
}

// Deliberate thresholds — requires intent, not accidental brushes
const SWIPE_THRESHOLD = 60;       // px for slow swipe
const VELOCITY_THRESHOLD = 0.45;  // px/ms for fast flick
const MIN_VELOCITY_DIST = 25;     // min px even for fast flick

// ─── Chip bar ────────────────────────────────────────────────────────────────

type ChipBarProps = {
  pageIndex: number;
  isDark: boolean;
  onSelect: (i: number) => void;
  notifs: ChipNotifs;
  // Continuous swipe position (0..PAGE_COUNT-1) and drag flag, so the chip
  // bar can scroll in lockstep with the page slide.
  swipeProgress: number;
  isDragging: boolean;
};

// Solve for y on a cubic-bezier (p1=(x1,y1), p2=(x2,y2)) at parametric x.
// Matches the 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94) used on the page
// transform so the chip scroll lands at the exact same instant.
function bezierEase(x1: number, y1: number, x2: number, y2: number, x: number): number {
  // Sample cubic at parameter t
  const sample = (a: number, b: number, t: number) =>
    ((1 - 3 * b + 3 * a) * t + (3 * b - 6 * a)) * t * t + 3 * a * t;
  // Newton-Raphson to find t such that sampleX(t) = x
  let t = x;
  for (let i = 0; i < 5; i++) {
    const dx = sample(x1, x2, t) - x;
    const slope = 3 * (1 - 3 * x2 + 3 * x1) * t * t + 2 * (3 * x2 - 6 * x1) * t + 3 * x1;
    if (Math.abs(slope) < 1e-6) break;
    t -= dx / slope;
  }
  return sample(y1, y2, Math.max(0, Math.min(1, t)));
}

function ChipBar({ pageIndex, isDark, onSelect, notifs, swipeProgress, isDragging }: ChipBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Array<HTMLDivElement | null>>([]);
  const animationRef = useRef<number | null>(null);

  // Compute the scrollLeft that centers chip i (clamped at the bar edges).
  const getTargetScroll = useCallback((i: number) => {
    const bar = barRef.current;
    const chip = chipRefs.current[i];
    if (!bar || !chip) return 0;
    const maxScroll = bar.scrollWidth - bar.clientWidth;
    const center = chip.offsetLeft + chip.offsetWidth / 2;
    return Math.max(0, Math.min(maxScroll, center - bar.clientWidth / 2));
  }, []);

  // DRAG: track the live swipe position in real time, no animation.
  useEffect(() => {
    if (!isDragging) return;
    const bar = barRef.current;
    if (!bar) return;
    // Cancel any in-flight settle animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    const lower = Math.floor(swipeProgress);
    const upper = Math.min(CHIPS.length - 1, lower + 1);
    const t = swipeProgress - lower;
    bar.scrollLeft = getTargetScroll(lower) * (1 - t) + getTargetScroll(upper) * t;
  }, [swipeProgress, isDragging, getTargetScroll]);

  // SETTLE / chip tap: animate scrollLeft over 350ms with the same easing
  // curve as the page transform, kicked off when pageIndex changes (and
  // we're not in the middle of a drag).
  useEffect(() => {
    if (isDragging) return;
    const bar = barRef.current;
    if (!bar) return;
    const target = getTargetScroll(pageIndex);
    const start = bar.scrollLeft;
    if (Math.abs(target - start) < 0.5) return;
    const startTime = performance.now();
    const duration = 350;
    const tick = (now: number) => {
      const linearT = Math.min(1, (now - startTime) / duration);
      const eased = bezierEase(0.25, 0.46, 0.45, 0.94, linearT);
      bar.scrollLeft = start + (target - start) * eased;
      animationRef.current = linearT < 1 ? requestAnimationFrame(tick) : null;
    };
    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [pageIndex, isDragging, getTargetScroll]);

  return (
    <div ref={barRef} className={styles.chipBar}>
      {CHIPS.map((c, i) => {
        const isSelected = i === pageIndex;
        const chipClass = isSelected
          ? (isDark ? styles.chipSelectedDark : styles.chipSelected)
          : isDark
          ? styles.chipUnselectedDark
          : styles.chipUnselectedLight;
        const notifColor = notifs[c.key];
        return (
          <div
            key={c.key}
            ref={(el) => { chipRefs.current[i] = el; }}
            className={styles.chipWrapper}
          >
            <button className={`${styles.chip} ${chipClass}`} onClick={() => onSelect(i)}>
              {c.label}
            </button>
            {notifColor && !isSelected && (
              <span
                className={styles.chipNotifDot}
                style={{ background: NOTIF_DOT_COLORS[notifColor] }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Bank Payment Screen ─────────────────────────────────────────────────────

function BankPaymentScreen({ amount, onBack }: { amount: number; onBack: () => void }) {
  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    setPaid(true);
    setTimeout(onBack, 2200);
  };

  return (
    <div className={styles.bankPayScreen}>
      <div className={styles.bankPayHeader}>
        <button className={styles.bankPayBack} onClick={onBack}>
          <ChevronLeft size={24} color="white" />
        </button>
        <span className={styles.bankPayHeaderTitle}>Make Payment</span>
        <div style={{ width: 32 }} />
      </div>

      {!paid ? (
        <>
          <div className={styles.bankPayAmountSection}>
            <p className={styles.bankPayAmountLabel}>Amount Due</p>
            <p className={styles.bankPayAmountValue}>${amount}</p>
            <p className={styles.bankPayAmountSub}>Overlimit balance</p>
          </div>

          <div className={styles.bankPayBody}>
            <div className={styles.bankPayMethodCard}>
              <div className={styles.bankPayBankIconWrap}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M3 10L12 3L21 10V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V10Z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.bankPayBankInfo}>
                <p className={styles.bankPayBankName}>Chase Checking</p>
                <p className={styles.bankPayBankSub}>••••4521 · Available $1,240.00</p>
              </div>
              <span className={styles.bankPaySelectedCheck}>
                <CheckLineIcon size={20} color="#049B82" />
              </span>
            </div>

            <div style={{ flex: 1 }} />
            <p className={styles.bankPayDisclosure}>Payment processes immediately. Funds typically clear within 1–2 business days.</p>
            <button className={styles.bankPayBtn} onClick={handlePay}>
              Pay ${amount} now
            </button>
          </div>
        </>
      ) : (
        <div className={styles.bankPaySuccessBody}>
          <div className={styles.bankPaySuccessRing}>
            <CheckLineIcon size={32} color="white" />
          </div>
          <p className={styles.bankPaySuccessTitle}>Payment Sent!</p>
          <p className={styles.bankPaySuccessSub}>Your payment of ${amount} is being processed and will post within 1–2 business days.</p>
        </div>
      )}
    </div>
  );
}

// ─── All page content ────────────────────────────────────────────────────────

function AllContent({ data, cardAdopted, hasOrder, hasTracking, onGoToMarketplace, onTrackOrder, onGoToCard, onGoToCash, onGoToBillSplitter, onBankPayment }: {
  data: DashboardData;
  cardAdopted: boolean;
  hasOrder: boolean;
  hasTracking: boolean;
  onGoToMarketplace: () => void;
  onTrackOrder: () => void;
  onGoToCard: () => void;
  onGoToCash: () => void;
  onGoToBillSplitter: () => void;
  onBankPayment: () => void;
}) {
  const isOverlimit = data.card.isOverlimit ?? false;
  const cardAvailable = data.card.creditLimit - data.card.currentBalance;

  return (
    <div className={styles.pageContent}>

      {/* ── Top product cards ── */}
      <div className={styles.cardGroup}>
        {/* Marketplace */}
        <div
          className={styles.productCard}
          style={{ cursor: 'pointer' }}
          onClick={onGoToMarketplace}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onGoToMarketplace()}
          aria-label="Open Marketplace details"
        >
          <div className={styles.productCardBody}>
            <div className={styles.productCardHeader}>
              <span className={styles.productCardTitle}>Marketplace</span>
              <ChevronRight size={18} color="#9aa3b2" />
            </div>
            <div className={styles.productCardValueRow}>
              <span className={styles.productCardValue}>${data.spending.marketplaceAvailable.toLocaleString()}</span>
              <span className={styles.productCardSubvalue}>left to spend</span>
            </div>
            {hasOrder && hasTracking && (
              <div className={styles.productCardStrip}>
                <div className={styles.productCardStripLeft}>
                  <div className={styles.orderThumbCircle}>
                    <img src={A.otProductThumb} alt="" className={styles.orderThumbCircleImg} />
                  </div>
                </div>
                <button
                  className={styles.trackOrderLink}
                  onClick={(e) => { e.stopPropagation(); onTrackOrder(); }}
                >
                  Check order status <ArrowRight size={18} color="#2e71ea" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Credit Card */}
        <div
          className={styles.productCard}
          style={{ cursor: 'pointer' }}
          onClick={onGoToCard}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onGoToCard()}
          aria-label="Open Credit Card details"
        >
          <div className={styles.productCardBody}>
            <div className={styles.productCardHeader}>
              <span className={styles.productCardTitle}>Credit Card</span>
              <ChevronRight size={18} color="#9aa3b2" />
            </div>
            <div className={styles.productCardValueRow}>
              {cardAdopted && isOverlimit ? (
                <>
                  <span className={styles.productCardValue}>${data.card.currentBalance}</span>
                  <span className={`${styles.productCardSubvalue} ${styles.productCardSubvalueOverlimit}`}>Overlimit</span>
                </>
              ) : cardAdopted ? (
                <>
                  <span className={styles.productCardValue}>${cardAvailable.toLocaleString()}</span>
                  <span className={styles.productCardSubvalue}>Available Credit</span>
                </>
              ) : (
                <>
                  <span className={styles.productCardValue}>${data.card.creditLimit.toLocaleString()}</span>
                  <span className={styles.productCardSubvalue}>Apply now</span>
                </>
              )}
            </div>
            {cardAdopted && isOverlimit && (
              <div className={styles.productCardStrip}>
                <div className={styles.productCardStripLeft}>
                  <img src={A.overlimitWarningIcon} alt="" className={styles.orderThumbCircleImg} />
                </div>
                <button
                  className={styles.trackOrderLink}
                  onClick={(e) => { e.stopPropagation(); onBankPayment(); }}
                >
                  Make bank payment <ArrowRight size={18} color="#2e71ea" />
                </button>
              </div>
            )}
            {cardAdopted && !isOverlimit && hasTracking && (
              <div className={styles.productCardStrip}>
                <div className={styles.productCardStripLeft}>
                  <img src={smallCardImg} alt="" className={styles.miniCard} />
                </div>
                <button
                  className={styles.trackOrderLink}
                  onClick={(e) => { e.stopPropagation(); onGoToCard(); }}
                >
                  Track card <ArrowRight size={18} color="#2e71ea" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cash Assist */}
        <div
          className={styles.productCard}
          style={{ cursor: 'pointer' }}
          onClick={onGoToCash}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onGoToCash()}
          aria-label="Open Cash Assist details"
        >
          <div className={styles.productCardBody}>
            <div className={styles.productCardHeader}>
              <span className={styles.productCardTitle}>Cash Assist</span>
              <ChevronRight size={18} color="#9aa3b2" />
            </div>
            <div className={styles.productCardValueRow}>
              <span className={styles.productCardValue}>$53</span>
              <span className={styles.productCardSubvalue}>left to repay</span>
            </div>
          </div>
        </div>

        {/* Bill Splitter */}
        <div
          className={styles.productCard}
          style={{ cursor: 'pointer' }}
          onClick={onGoToBillSplitter}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onGoToBillSplitter()}
          aria-label="Open Bill Splitter details"
        >
          <div className={styles.productCardBody}>
            <div className={styles.productCardHeader}>
              <span className={styles.productCardTitle}>Bill Splitter</span>
              <ChevronRight size={18} color="#9aa3b2" />
            </div>
            <div className={styles.productCardValueRow}>
              <span className={styles.productCardValue}>100%</span>
              <span className={styles.productCardSubvalue}>Covered</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Credit Building Progress ── */}
      <div className={styles.section}>
        <p className={styles.sectionLabel}>Credit Building Progress</p>
        <div className={styles.creditCard}>
          <div className={styles.creditCardBody}>
            <div className={styles.creditGraphArea}>
              <CreditBuildingGraph />
            </div>
            <div className={styles.creditCardText}>
              <p className={styles.creditTitle}>Credit Building</p>
              <p className={styles.creditSubtitle}>Nothing is being reported</p>
            </div>
          </div>
          <div className={styles.creditGetStarted}>Get started</div>
        </div>
      </div>

      {/* ── Discover more ── */}
      <div className={styles.section}>
        <p className={styles.sectionLabel}>Discover more</p>
        <div className={styles.discoverScroll} data-carousel>
          <div className={styles.promoCard}>
            <div className={styles.promoCardInner}>
              <div className={styles.promoChip}>Marketplace</div>
              <p className={styles.promoTitle}>Pay in up to 10 pays &amp; build credit</p>
              <div className={styles.promoShopLink}>Shop now <ArrowRight size={18} color="#2e71ea" /></div>
            </div>
            <div className={styles.promoProductArea}>
              <img src={marketplacePromoImg} alt="Marketplace products" className={styles.airpodsImg} />
            </div>
          </div>
          <div className={styles.darkPromoCard}>
            <div className={styles.darkPromoCardBody}>
              <div className={styles.darkPromoChip}>Credit Card</div>
              <p className={styles.darkPromoTitle}>Get up to $1,500 Credit Limit</p>
              <div className={styles.checkEligBtn}>Apply now <ChevronRight size={18} color="#2e71ea" /></div>
            </div>
            <div className={styles.creditCardImgArea}>
              <img src={creditCardPromoImg} alt="Perpay Credit Card" className={styles.creditCardPromoImg} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Credit Builder section ── */}
      <div className={styles.section}>
        <div className={styles.sectionLabelRow}><span>Credit Builder</span><ArrowRight size={18} /></div>
        <div className={styles.sectionCard}>
          <div className={styles.sectionCardInner}>
            <p className={styles.sectionCardTitle}>What's working</p>
            <div className={styles.rowItem}>
              <div className={styles.rowItemLeft}>
                <div className={styles.iconSquare}><ClockIcon /></div>
                <div className={styles.rowItemText}>
                  <span className={styles.rowItemLabel}>Order Payment History</span>
                  <span className={styles.rowItemValue}>{data.creditBuilding.paymentHistoryPercent}% on time</span>
                </div>
              </div>
              <span className={`${styles.pill} ${styles.pillSuccess}`}>Excellent</span>
            </div>
            <div className={styles.dividerLine} />
            <div className={styles.rowItem}>
              <div className={styles.rowItemLeft}>
                <div className={styles.iconSquare}><HourglassIcon /></div>
                <div className={styles.rowItemText}>
                  <span className={styles.rowItemLabel}>Perpay+ Account Age</span>
                  <span className={styles.rowItemValue}>{data.creditBuilding.accountAgeYears} yr, {data.creditBuilding.accountAgeMonths} months</span>
                </div>
              </div>
              <span className={`${styles.pill} ${styles.pillSuccess}`}>Established</span>
            </div>
          </div>
          <div className={styles.viewAllBtn}>View all</div>
        </div>
      </div>

      {/* ── Credit Card section ── */}
      <div className={styles.section}>
        <div className={styles.sectionLabelRow}><span>Credit Card</span><ArrowRight size={18} /></div>
        <div className={styles.sectionCard}>
          <div className={styles.sectionCardInner}>
            <p className={styles.sectionCardTitle}>Recent transactions</p>
            <div className={styles.txRow}>
              <div><div className={styles.txMerchant}>REANIMATOR</div><div className={styles.txDate}>4/3/23</div></div>
              <span className={styles.txAmount}>$32</span>
            </div>
            <div className={styles.dividerLine} />
            <div className={styles.txRow}>
              <div><div className={styles.txMerchant}>REANIMATOR</div><div className={styles.txDate}>4/3/23</div></div>
              <span className={styles.txAmount}>$32</span>
            </div>
          </div>
          <div className={styles.viewAllBtn}>View all</div>
        </div>
      </div>

      {/* ── Marketplace section ── */}
      <div className={styles.section}>
        <div className={styles.sectionLabelRow}><span>Marketplace</span><ArrowRight size={18} /></div>
        <div className={styles.sectionCard}>
          <div className={styles.sectionCardInner}>
            <p className={styles.sectionCardTitle}>Orders in repayment</p>
            <div className={styles.orderRow}>
              <div className={styles.orderImages}>
                <div className={styles.orderThumb}>🛍</div>
                <div className={styles.orderThumb}>🛍</div>
              </div>
              <div className={styles.orderMeta}><span className={styles.orderPct}>2%</span><span className={styles.orderPctLabel}>Paid off</span></div>
              <div className={styles.trackBtn}>Track</div>
            </div>
            <div className={styles.dividerLine} />
            <div className={styles.orderRow}>
              <div className={styles.orderImages}>
                <div className={styles.orderThumb}>🛍</div>
                <div className={styles.orderThumb}>🛍</div>
                <div className={styles.orderThumb} style={{ left: 32, zIndex: 0 }}>🛍</div>
              </div>
              <div className={styles.orderMeta}><span className={styles.orderPct}>80%</span><span className={styles.orderPctLabel}>Paid off</span></div>
              <span style={{ fontSize: 10, color: '#324b6c' }}>3 items</span>
            </div>
          </div>
          <div className={styles.viewAllBtn}>View all</div>
        </div>
      </div>

    </div>
  );
}

// ─── Marketplace page content ────────────────────────────────────────────────

function MarketplaceContent({ data, hasOrder, onTrackOrder }: { data: DashboardData; hasOrder: boolean; onTrackOrder: () => void }) {
  const balancePct = (data.spending.currentBalance / data.spending.totalLimit) * 100;
  const fillWidth = Math.round((balancePct / 100) * 311);
  const spendingStr = data.spending.spendingLimit.toFixed(2).split('.');

  return (
    <div className={styles.pageContent}>

      <div className={styles.spendingSection}>
        <p className={styles.spendingLabel}>Available Spending Limit</p>
        <div className={styles.spendingAmountRow}>
          <span className={styles.spendingDollars}>${spendingStr[0]}</span>
          <span className={styles.spendingCents}>.{spendingStr[1]}</span>
        </div>
      </div>

      <div className={styles.mpL2Card}>
        <div className={styles.mpL2Banner}>
          <span className={styles.mpL2BannerIcon}>ℹ</span>
          <span>Your marketplace spending limit refreshes each pay period</span>
        </div>
        <div className={styles.mpL2Body}>
          <div className={styles.mpL2TopRow}>
            <span className={styles.mpL2BalanceLabel}>Current Balance: ${data.spending.currentBalance.toLocaleString()}</span>
            <span className={styles.mpL2DotsBtn}>···</span>
          </div>
          <div className={styles.mpL2BarArea}>
            <div className={styles.mpL2BarTrack}>
              <div className={styles.mpL2BarFill} style={{ width: fillWidth }} />
            </div>
            <div className={styles.mpL2CurrentMarker} style={{ left: `${balancePct}%` }}>
              <span className={styles.mpL2MarkerLabel}>${data.spending.currentBalance}</span>
              <span className={styles.mpL2MarkerTriangle} />
            </div>
            <span className={styles.mpL2MaxLabel}>${data.spending.totalLimit}</span>
          </div>
        </div>
      </div>

      <div className={styles.favoritesRow}>
        <div className={styles.favoritesCard}>
          <div className={styles.favBrandLogos}>
            <div className={styles.favBrandLogo} style={{ background: '#e8f0fe' }} />
            <div className={styles.favBrandLogo} style={{ background: '#fce8e6' }} />
            <div className={styles.favBrandLogo} style={{ background: '#e6f4ea' }} />
          </div>
          <span className={styles.favLabel}>Your Favorites</span>
        </div>
        <div className={styles.favoritesCard}>
          <div className={styles.favBrandLogos}>
            <div className={styles.favBrandLogo} style={{ background: '#fff3e0' }} />
            <div className={styles.favBrandLogo} style={{ background: '#b42c2c' }} />
            <div className={styles.favBrandLogo} style={{ background: '#f3e5f5' }} />
          </div>
          <span className={styles.favLabel}>Your Top Brands</span>
        </div>
      </div>

      {hasOrder ? (
        <>
          <div className={styles.ordersSection}>
            <div className={styles.ordersSectionHeader}><span>Orders</span><span className={styles.sectionArrow}>›</span></div>
            <div className={styles.ordersFilterRow}>
              <button className={`${styles.filterChip} ${styles.filterChipActive}`}>Active</button>
              <button className={`${styles.filterChip} ${styles.filterChipInactive}`}>Complete</button>
            </div>
            <div className={styles.orderCard} style={{ cursor: 'pointer' }} onClick={onTrackOrder} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onTrackOrder()}>
              <div className={styles.orderCardThumb} />
              <div className={styles.orderCardInfo}>
                <div className={styles.orderStatusBadge}>In transit</div>
                <div className={styles.orderCardTitle}>Arrives in {data.order.arrivalDays} days</div>
                <div className={styles.orderCardSub}>Order #{data.order.orderNumber}</div>
              </div>
              <span style={{ fontSize: 18, color: '#9aa3b2' }}>›</span>
            </div>
          </div>

          <div className={styles.continueCheckoutHeader}><span>Continue checkout</span><span className={styles.sectionArrow}>›</span></div>
          <div className={styles.continueCard}>
            <div className={styles.continueThumb} />
            <div className={styles.continueInfo}>
              <div className={styles.continueTitle}>{data.checkout.itemCount} items</div>
              <div className={styles.continueSteps}>{data.checkout.stepsLeft} step left</div>
              <div className={styles.continueExpire}>expires in {data.checkout.expiresInDays} days</div>
            </div>
            <span className={styles.continueStepBadge}>{data.checkout.stepsLeft} step left</span>
          </div>

          <div className={styles.paymentsSection}>
            <p className={styles.paymentsHeader}>Upcoming Marketplace Payments</p>
            <div className={styles.paymentCard}>
              <div className={styles.paymentCardTop}>
                <div className={styles.paymentLeft}>
                  <div className={styles.paymentIconWrap}>
                    <CalendarCheckLineIcon />
                  </div>
                  <div>
                    <div className={styles.paymentName}>Next paycheck</div>
                    <div className={styles.paymentSub}>Direct deposit payment</div>
                  </div>
                </div>
                <span className={styles.paymentAmount}>${data.payments.nextPaycheckAmount.toFixed(2)}</span>
              </div>
              <div className={styles.paymentCoversBadge}>
                <span className={styles.paymentCoversBadgeIcon}><CheckLineIcon size={16} color="#049B82" /></span>
                <span>Covers required minimum amount</span>
              </div>
              <div className={styles.paymentDivider} />
              <div className={styles.viewPastBtn}>View past payments</div>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.ordersSection}>
          <div className={styles.ordersSectionHeader}><span>Orders</span></div>
          <div
            className={styles.cardDashed}
            style={{ cursor: 'pointer' }}
            onClick={() => {}}
            role="button"
            tabIndex={0}
          >
            <div className={styles.mpEmptyState}>
              <p className={styles.mpEmptyStateTitle}>No orders yet</p>
              <p className={styles.mpEmptyStateSub}>Browse the marketplace to place your first order</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ─── Card page content ───────────────────────────────────────────────────────

const CARD_MGMT_ITEMS = [
  'Statements & Documents',
  'Add Card To Wallet',
  'Freeze Card',
  'Settings',
  'Need help? Contact Us',
];

function CardAdoptedContent({ creditLimit }: { creditLimit: number }) {
  return (
    <div className={styles.cardAdoptedPageContent}>

      <div className={styles.cardAdoptedHero}>
        <p className={styles.cardAdoptedLimitLabel}>Available Credit Limit</p>
        <p className={styles.cardAdoptedLimit}>${creditLimit.toLocaleString()}</p>
      </div>

      <div className={styles.cardBalanceCard}>
        <div className={styles.cardBalanceRow}>
          <span className={styles.cardBalanceLabel}>Current Balance: $0</span>
          <span style={{ color: '#4f6784', fontSize: 18, lineHeight: 1, cursor: 'pointer' }}>···</span>
        </div>
        <div className={styles.cardBalanceBar} />
        <div className={styles.cardBalanceBarLabels}>
          <span className={styles.cardBalanceBarLabel}>$0</span>
          <span className={styles.cardBalanceBarLabel}>${creditLimit.toLocaleString()}</span>
        </div>
      </div>

      <div className={styles.cardActivitySection}>
        <p className={styles.cardActivityLabel}>Activity</p>
        <div className={styles.cardActivityEmpty}>
          <p className={styles.cardActivityEmptyTitle}>Keep track easily</p>
          <p className={styles.cardActivityEmptySub}>Future payments and transactions will pop up here</p>
        </div>
      </div>

      <div className={styles.cardMgmtCard}>
        <p className={styles.cardMgmtHeader}>Card Management</p>
        {CARD_MGMT_ITEMS.map((label, i) => (
          <div key={i} className={styles.cardMgmtItem}>
            <span className={styles.cardMgmtItemLabel}>{label}</span>
            <ChevronRight size={18} color="#9aa3b2" />
          </div>
        ))}
      </div>

    </div>
  );
}

const CARD_ACTIVITY = [
  { merchant: 'REANIMATOR', date: '01/01/2026', amount: '$7.43' },
  { merchant: 'Netflix', date: '01/07/2026', amount: '$19.64' },
  { merchant: 'Payment', date: '01/01/2026', amount: '$50.00' },
  { merchant: 'Starbucks', date: '01/07/2026', amount: '$10.32' },
];

function CardOverlimitContent({ data, onBankPayment }: { data: DashboardData; onBankPayment: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const overlimitAmount = data.card.currentBalance;
  const creditLimit = data.card.creditLimit;

  return (
    <div className={styles.cardAdoptedPageContent}>

      <div className={styles.cardAdoptedHero}>
        <p className={styles.cardAdoptedLimitLabel}>Overlimit</p>
        <p className={styles.cardAdoptedLimit}>${overlimitAmount}</p>
      </div>

      {/* ── Notifications ── */}
      <div className={styles.notificationSection}>
        {/* Notification 1: Overlimit — always visible */}
        <div className={styles.notificationCardWrap}>
          <div className={styles.notificationCard}>
            <div className={styles.notificationCardTop}>
              <img src={A.overlimitWarningIcon} alt="" className={styles.notificationIcon} />
              <div className={styles.notificationText}>
                <p className={styles.notificationTitle}>Your card is over the limit</p>
                <p className={styles.notificationBody}>Your card is currently over it's limit. Make a payment to reduce your balance.</p>
              </div>
            </div>
            <button className={styles.makeBankPaymentBtn} onClick={onBankPayment}>Make bank payment</button>
          </div>
          {/* Count badge — hidden once expanded */}
          {!expanded && <div className={styles.countBadge}>2</div>}
        </div>

        {/* Notification 2: Card Reshipping — animated, directly below #1 */}
        <div className={`${styles.notification2Wrap} ${expanded ? styles.notification2WrapVisible : ''}`}>
          <div className={styles.notification2Card}>
            <div className={styles.notificationCardTop}>
              <img src={hourglassImg} alt="" className={styles.notification2Icon} />
              <div className={styles.notificationText}>
                <p className={styles.notificationTitle}>Card Shipped</p>
                <p className={styles.notificationBody}>Estimated arrival: June 5th</p>
              </div>
            </div>
            <button className={styles.trackBtn}>Track</button>
          </div>
        </div>

        {/* Toggle: below all notifications */}
        <button className={styles.seeMoreToggle} onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Tap to see 1 less' : 'Tap to see 1 more'}
        </button>
      </div>

      {/* ── Progress bar ── */}
      <div className={styles.cardBalanceCard}>
        <div className={styles.overlimitProgressBarWrap}>
          <div className={styles.overlimitProgressBar} />
        </div>
        <div className={styles.cardBalanceBarLabels}>
          <span className={styles.cardBalanceBarLabel}>${(creditLimit + overlimitAmount).toLocaleString()} spent</span>
          <span className={styles.cardBalanceBarLabel}>of ${creditLimit.toLocaleString()} limit</span>
        </div>
      </div>

      {/* ── Activity ── */}
      <div className={styles.cardActivitySection}>
        <div className={styles.overlimitActivityCard}>
          <p className={styles.cardActivityLabel}>Activity</p>
          <div className={styles.overlimitActivityDivider} />
          {CARD_ACTIVITY.map((item, i) => (
            <div key={i}>
              <div className={styles.overlimitActivityRow}>
                <div>
                  <p className={styles.overlimitActivityMerchant}>{item.merchant}</p>
                  <p className={styles.overlimitActivityDate}>{item.date}</p>
                </div>
                <p className={styles.overlimitActivityAmount}>{item.amount}</p>
              </div>
              {i < CARD_ACTIVITY.length - 1 && <div className={styles.overlimitActivityRowDivider} />}
            </div>
          ))}
          <div className={styles.overlimitActivityDivider} />
          <button className={styles.viewMoreBtn}>View More</button>
        </div>
      </div>

      {/* ── Card Management ── */}
      <div className={styles.cardMgmtCard}>
        <p className={styles.cardMgmtHeader}>Card Management</p>
        {CARD_MGMT_ITEMS.map((label, i) => (
          <div key={i} className={styles.cardMgmtItem}>
            <span className={styles.cardMgmtItemLabel}>{label}</span>
            <ChevronRight size={18} color="#9aa3b2" />
          </div>
        ))}
      </div>

    </div>
  );
}

function CardContent({ onApply, cardAdopted, creditLimit, data, onBankPayment, isActive }: {
  onApply: () => void;
  cardAdopted: boolean;
  creditLimit: number;
  data: DashboardData;
  onBankPayment: () => void;
  isActive: boolean;
}) {
  if (cardAdopted && data.card.isOverlimit) return <CardOverlimitContent data={data} onBankPayment={onBankPayment} />;
  if (cardAdopted) return <CardAdoptedContent creditLimit={creditLimit} />;

  // Not adopted → use the reusable empty-state template. Wired to onApply
  // so tapping "Apply now" still triggers the existing applying-overlay flow.
  return (
    <EmptyStatePage
      config={{ ...cardEmptyState, onCta: onApply }}
      isActive={isActive}
    />
  );
}

// ─── Card apply overlays ─────────────────────────────────────────────────────

function CardApplyingOverlay({ show }: { show: boolean }) {
  return (
    <div className={`${styles.applyOverlay} ${show ? styles.applyOverlayVisible : ''}`}>
      <div className={styles.applySpinner} />
      <p className={styles.applySpinnerLabel}>Reviewing your application…</p>
    </div>
  );
}

function CardApprovalOverlay({ show, onBack }: { show: boolean; onBack: () => void }) {
  return (
    <div className={`${styles.approvalOverlay} ${show ? styles.approvalOverlayVisible : ''}`}>
      <div className={styles.approvalContent}>
        <div className={styles.approvalCheckCircle}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="22" fill="#2e71ea" />
            <path d="M12 22L19 29L32 15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className={styles.approvalTitle}>Your application is approved!</p>
        <p className={styles.approvalSubtitle}>Welcome to the Perpay Credit Card. Your card is on its way.</p>
      </div>
      <div className={styles.approvalFooter}>
        <button className={styles.approvalBtn} onClick={onBack}>Back to dashboard</button>
      </div>
    </div>
  );
}

// ─── Gradient Test: shared product page template ─────────────────────────────
//
// Used by the `allActiveGradientTest1` scenario. Every active-product tab
// renders this exact layout so swiping between Marketplace, Card, Cash Assist,
// and Bill Splitter has zero vertical shift — only the gradient background
// and the hero amount change.

const CARD_MGMT_LIST = [
  'Statements & Documents',
  'Add Card To Wallet',
  'Freeze Card',
  'Settings',
  'Need help? Contact Us',
];
const LOAN_MGMT_LIST = [
  'Statements & Documents',
  'Settings',
  'Need help? Contact Us',
];

type GradientTestPageProps = {
  topLabel: string;
  bigText: string;
  dimSuffix?: string;
  totalLimit: number;
  managementTitle: string;
  managementItems: string[];
  // Switch hero text to a dark palette (used on the Savings light-yellow bg).
  lightTheme?: boolean;
};

function GradientTestPage({ topLabel, bigText, dimSuffix, totalLimit, managementTitle, managementItems, lightTheme }: GradientTestPageProps) {
  const labelCls = `${styles.gradTestHeroLabel} ${lightTheme ? styles.gradTestHeroLabelLight : ''}`;
  const mainCls  = `${styles.gradTestHeroMain} ${lightTheme ? styles.gradTestHeroMainLight : ''}`;
  const dimCls   = `${styles.gradTestHeroDim} ${lightTheme ? styles.gradTestHeroDimLight : ''}`;
  return (
    <div className={styles.gradTestPage}>
      <div className={styles.gradTestHero}>
        <p className={labelCls}>{topLabel}</p>
        <div className={styles.gradTestHeroAmountRow}>
          <span className={mainCls}>{bigText}</span>
          {dimSuffix && <span className={dimCls}>{dimSuffix}</span>}
        </div>
      </div>

      <div className={styles.gradTestBalanceCard}>
        <div className={styles.gradTestBalanceRow}>
          <span className={styles.gradTestBalanceLabel}>Current Balance: $0</span>
          <span className={styles.gradTestBalanceDots}>···</span>
        </div>
        <div className={styles.gradTestBalanceBarWrap}>
          <div className={styles.gradTestBalanceBar} />
          <span className={styles.gradTestBalanceBarLeftLabel}>$0</span>
          <span className={styles.gradTestBalanceBarRightLabel}>${totalLimit}</span>
        </div>
      </div>

      <div className={styles.gradTestSectionCard}>
        <p className={styles.gradTestSectionTitle}>Activity</p>
        <div className={styles.gradTestEmptyCard}>
          <p className={styles.gradTestEmptyTitle}>Keep track easily</p>
          <p className={styles.gradTestEmptySub}>Future payments and transactions will pop up here</p>
        </div>
      </div>

      <div className={styles.gradTestMgmtCard}>
        <p className={styles.gradTestMgmtHeader}>{managementTitle}</p>
        {managementItems.map((label) => (
          <div key={label} className={styles.gradTestMgmtItem}>
            <span className={styles.gradTestMgmtItemLabel}>{label}</span>
            <ChevronRight size={18} color="#9aa3b2" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Placeholder pages ───────────────────────────────────────────────────────

function PlaceholderContent({ label }: { label: string }) {
  return (
    <div className={styles.pageContent}>
      <div className={styles.placeholderWrap}>
        <div className={styles.placeholderCard}>
          <p className={styles.placeholderLabel}>{label}</p>
          <p className={styles.placeholderSub}>Coming soon</p>
        </div>
      </div>
    </div>
  );
}

// ─── Shop page ───────────────────────────────────────────────────────────────

const SHOP_CATEGORIES = ['All', 'Electronics', 'Appliances', 'Gaming', 'Audio'];

const SHOP_PRODUCTS = [
  { id: 1, brand: 'Apple', name: 'AirPods Pro', payAmount: 24.90, bg: '#eef2ff' },
  { id: 2, brand: 'Apple', name: 'Apple Watch SE', payAmount: 22.90, bg: '#eef2ff' },
  { id: 3, brand: 'Samsung', name: '65" QLED 4K TV', payAmount: 109.90, bg: '#eef4f8' },
  { id: 4, brand: 'KitchenAid', name: 'Pro 5 Stand Mixer', payAmount: 44.90, bg: '#fff3ed' },
  { id: 5, brand: 'Sony', name: 'PlayStation 5', payAmount: 49.90, bg: '#f0eeff' },
  { id: 6, brand: 'Dyson', name: 'V15 Detect', payAmount: 74.90, bg: '#edfaf4' },
  { id: 7, brand: 'Apple', name: 'iPad Air M2', payAmount: 59.90, bg: '#eef2ff' },
  { id: 8, brand: 'Nintendo', name: 'Switch OLED', payAmount: 34.90, bg: '#ffeef8' },
];

function ShopOverlay({ show, onBack }: { show: boolean; onBack: () => void }) {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className={`${styles.shopOverlay} ${show ? styles.shopOverlayVisible : ''}`}>
      <div className={styles.shopHeader}>
        <p className={styles.shopTitle}>Shop</p>
      </div>

      <div className={styles.shopScrollArea}>
        <div className={styles.shopCategoryBar}>
          {SHOP_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.shopCategoryChip} ${activeCategory === cat ? styles.shopCategoryChipActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.shopGrid}>
          {SHOP_PRODUCTS.map((p) => (
            <div key={p.id} className={styles.shopProductCard}>
              <div className={styles.shopProductImgArea} style={{ background: p.bg }} />
              <div className={styles.shopProductInfo}>
                <p className={styles.shopProductBrand}>{p.brand}</p>
                <p className={styles.shopProductName}>{p.name}</p>
                <p className={styles.shopProductPay}>
                  ${p.payAmount.toFixed(2)}<span className={styles.shopProductPaySub}>/pay</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <nav className={styles.shopBottomNav}>
        <div className={styles.navItems}>
          {NAV_ITEMS.map(({ label, icon }) => {
            const isActive = label === 'Shop';
            return (
              <div
                key={label}
                className={styles.navItem}
                style={{ cursor: 'pointer' }}
                onClick={() => { if (label === 'Home') onBack(); }}
              >
                <span style={{ color: isActive ? '#377feb' : '#113355', display: 'flex' }}>{icon}</span>
                <span className={isActive ? styles.navLabelActive : styles.navLabelInactive}>{label}</span>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// ─── Bottom Nav ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Home',     icon: <HomeLineIcon />,          active: true  },
  { label: 'Shop',     icon: <HandbagLineIcon />,        active: false },
  { label: 'Payments', icon: <CalendarCheckLineIcon />,  active: false },
  { label: 'Build',    icon: <ChartLineIcon />,          active: false },
];

function BottomNav({ onShopOpen }: { onShopOpen: () => void }) {
  return (
    <nav className={styles.bottomNav}>
      <div className={styles.navItems}>
        {NAV_ITEMS.map(({ label, icon, active }) => (
          <div
            key={label}
            className={styles.navItem}
            style={{ cursor: 'pointer' }}
            onClick={() => { if (label === 'Shop') onShopOpen(); }}
          >
            <span style={{ color: active ? '#377feb' : '#113355', display: 'flex' }}>{icon}</span>
            <span className={active ? styles.navLabelActive : styles.navLabelInactive}>{label}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}

// ─── Order Tracking overlay ──────────────────────────────────────────────────

function OrderTrackingOverlay({ data, show, onBack }: { data: DashboardData; show: boolean; onBack: () => void }) {
  const steps = [
    { title: 'Set up payroll direct deposit', body: null, hasButton: false },
    {
      title: 'Awaiting direct deposit',
      body: "After we receive your first direct deposit on your next payday, we'll ship your order",
      hasButton: false,
    },
    {
      title: "Your order is on it's way",
      body: 'Your order has been shipped. Sit back and wait for its arrival!',
      hasButton: true,
    },
  ];

  return (
    <div className={`${styles.otOverlay} ${show ? styles.otOverlayVisible : ''}`}>
      <div className={styles.otHeader}>
        <button className={styles.otBackBtn} onClick={onBack}>
          <ChevronLeft size={24} color="#113355" />
        </button>
        <button className={styles.otGetHelpBtn}>Get help</button>
      </div>

      <div className={styles.otContent}>
        <div className={styles.otThumbs}>
          <div className={styles.otThumb}><img src={A.otProductThumb} alt="" className={styles.otThumbImg} /></div>
          <div className={styles.otThumb}><img src={A.otProductThumb} alt="" className={styles.otThumbImg} /></div>
          <span className={styles.otPlusCount}>+3</span>
        </div>

        <div>
          <h2 className={styles.otHeadline}>Your order is on it's way!</h2>
          <p className={styles.otSubline}>Expected delivery in {data.order.arrivalDays} days · Order #{data.order.orderNumber}</p>
        </div>

        <div className={styles.otTimelineCard}>
          {steps.map((step, i) => (
            <div key={i} className={styles.otStepRow}>
              <div className={styles.otStepLeftCol}>
                <span className={styles.otCheckIcon}><CheckLineIcon size={16} color="#049B82" /></span>
                {i < steps.length - 1 && <div className={styles.otConnector} />}
              </div>
              <div className={styles.otStepContent}>
                <span className={styles.otStepTitle}>{step.title}</span>
                {step.body && <p className={styles.otStepBody}>{step.body}</p>}
                {step.hasButton && <button className={styles.otTrackBtn}>Track order</button>}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.otDetailCard}>
          <span className={styles.otDetailTitle}>Shipment details</span>
        </div>

        <div className={styles.otDetailCard}>
          <span className={styles.otDetailTitle}>Order details</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function Dashboard() {
  const data = useScenario<DashboardData>();
  const [page, setPage] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [screenW, setScreenW] = useState(375);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [showBankPayment, setShowBankPayment] = useState(false);
  const [cardAdopted, setCardAdopted] = useState(data.card.adopted);
  const [showCardApplying, setShowCardApplying] = useState(false);
  const [showCardApproval, setShowCardApproval] = useState(false);
  const [activeNav, setActiveNav] = useState<'home' | 'shop'>('home');

  const chipNotifs = getChipNotifs(data);

  const handleApplyNow = () => {
    setShowCardApplying(true);
    setTimeout(() => {
      setShowCardApplying(false);
      setShowCardApproval(true);
    }, 2000);
  };

  const handleApprovalBack = () => {
    setShowCardApproval(false);
    setCardAdopted(true);
    setPage(0);
  };

  const screenRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
    direction: null as null | 'h' | 'v',
    active: false,
  });
  // Keep page in a ref so native event handlers always read latest value
  const pageRef = useRef(page);
  pageRef.current = page;

  // Track actual rendered width for responsive transform math
  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScreenW(el.offsetWidth));
    ro.observe(el);
    setScreenW(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  // All touch handling via native listeners on the screen element.
  // Non-passive touchmove so we can preventDefault for horizontal swipes.
  // Swipe works from anywhere on screen (header, content, background).
  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;

    function onStart(e: TouchEvent) {
      if ((e.target as Element).closest('[data-carousel]')) return;
      gestureRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        startTime: Date.now(),
        direction: null,
        active: true,
      };
      setIsDragging(true);
    }

    function onMove(e: TouchEvent) {
      const g = gestureRef.current;
      if (!g.active) return;
      const dx = e.touches[0].clientX - g.startX;
      const dy = e.touches[0].clientY - g.startY;
      if (!g.direction) {
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8)
          g.direction = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
        return;
      }
      if (g.direction === 'h') {
        e.preventDefault();
        setDragOffset(dx);
      }
    }

    function onEnd(e: TouchEvent) {
      const g = gestureRef.current;
      g.active = false;
      const dx = e.changedTouches[0].clientX - g.startX;
      const dt = Math.max(1, Date.now() - g.startTime);
      const velocity = Math.abs(dx) / dt;
      setIsDragging(false);
      setDragOffset(0);
      if (g.direction !== 'h') return;
      const isLeft = dx < -SWIPE_THRESHOLD || (velocity > VELOCITY_THRESHOLD && dx < -MIN_VELOCITY_DIST);
      const isRight = dx > SWIPE_THRESHOLD || (velocity > VELOCITY_THRESHOLD && dx > MIN_VELOCITY_DIST);
      if (isLeft) setPage((p) => Math.min(PAGE_COUNT - 1, p + 1));
      else if (isRight) setPage((p) => Math.max(0, p - 1));
    }

    function onMouseDown(e: MouseEvent) {
      if ((e.target as Element).closest('[data-carousel]')) return;
      gestureRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startTime: Date.now(),
        direction: 'h',
        active: true,
      };
      setIsDragging(true);
    }

    function onMouseMove(e: MouseEvent) {
      const g = gestureRef.current;
      if (!g.active) return;
      setDragOffset(e.clientX - g.startX);
    }

    function onMouseUp(e: MouseEvent) {
      const g = gestureRef.current;
      if (!g.active) return;
      g.active = false;
      const dx = e.clientX - g.startX;
      const dt = Math.max(1, Date.now() - g.startTime);
      const velocity = Math.abs(dx) / dt;
      setIsDragging(false);
      setDragOffset(0);
      const isLeft = dx < -SWIPE_THRESHOLD || (velocity > VELOCITY_THRESHOLD && dx < -MIN_VELOCITY_DIST);
      const isRight = dx > SWIPE_THRESHOLD || (velocity > VELOCITY_THRESHOLD && dx > MIN_VELOCITY_DIST);
      if (isLeft) setPage((p) => Math.min(PAGE_COUNT - 1, p + 1));
      else if (isRight) setPage((p) => Math.max(0, p - 1));
    }

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd, { passive: true });
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const baseX = page * -screenW;
  const rawX = baseX + (isDragging ? dragOffset : 0);
  const clampedX = Math.max(-(PAGE_COUNT - 1) * screenW, Math.min(0, rawX));

  // Progress values peak at 1 when the corresponding page is centered.
  const darkProgress = Math.max(0, Math.min(1, 1 - Math.abs(clampedX + screenW) / screenW));
  const cardProgress = Math.max(0, Math.min(1, 1 - Math.abs(clampedX + 2 * screenW) / screenW));
  const cashProgress = Math.max(0, Math.min(1, 1 - Math.abs(clampedX + 3 * screenW) / screenW));
  const billSplitterProgress = Math.max(0, Math.min(1, 1 - Math.abs(clampedX + 4 * screenW) / screenW));
  const savingsProgress = Math.max(0, Math.min(1, 1 - Math.abs(clampedX + 5 * screenW) / screenW));

  const gradientTest = data.gradientTest === true;
  const emptyStates = data.emptyStates === true;
  const gradientV2 = gradientTest && data.gradientTestVersion === 2;
  const gradientV3 = gradientTest && data.gradientTestVersion === 3;
  const gradientV4 = gradientTest && data.gradientTestVersion === 4;
  const gradientV5 = gradientTest && data.gradientTestVersion === 5;
  const gradientV6 = gradientTest && data.gradientTestVersion === 6;
  // v2 and v5 both render layered base + glow (with ellipses) for Cash & BS.
  const hasGlowLayers = gradientV2 || gradientV5;
  // v6 inherits test 4's mint Cash (light theme), and adds light blue BS.
  const cashIsLight = gradientV4 || gradientV6;
  const bsIsLight = gradientV6;
  // In gradient-test mode, Cash + Bill Splitter pages also use a dark/saturated
  // top — so the header/chip bar needs to flip to its light-on-dark variant for
  // those tabs too.
  // Cash is light-bg in v4 + v6 (mint / mint variant); BS is light-bg in v6
  // (light blue). Those progresses shouldn't flip the header to dark mode.
  // Savings is dark in v5 (uses blue base) so its progress flips dark.
  const cashCountsAsDark = !cashIsLight;
  const bsCountsAsDark = !bsIsLight;
  const savingsCountsAsDark = gradientV5;
  // In the empty-states scenario each product tab reuses the corresponding
  // gradient-v6 background: Marketplace + Card are dark themes (white text),
  // Cash / Bill Splitter / Savings are light themes (dark text). Only the
  // dark-theme tabs should flip the header/chip bar to its dark variant.
  const emptyStatesDarkProgress = darkProgress + cardProgress;
  const isDark = emptyStates
    ? emptyStatesDarkProgress > 0.5
    : gradientTest
    ? (darkProgress > 0.5
        || cardProgress > 0.5
        || (cashCountsAsDark && cashProgress > 0.5)
        || (bsCountsAsDark && billSplitterProgress > 0.5)
        || (savingsCountsAsDark && savingsProgress > 0.5))
    : (darkProgress > 0.5 || cardProgress > 0.5);
  const easing = isDragging ? 'none' : 'opacity 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';

  // Per-page opacity: fades in when adjacent to current swipe position
  const pageOpacity = (i: number) =>
    Math.max(0, 1 - Math.abs(clampedX + i * screenW) / screenW);

  // Marketplace cents split for gradient-test hero
  const mpStr = data.spending.spendingLimit.toFixed(2).split('.');

  const pages = emptyStates
    ? [
        <AllContent
          data={data}
          cardAdopted={cardAdopted}
          hasOrder={data.hasOrder}
          hasTracking={data.hasTracking}
          onGoToMarketplace={() => setPage(1)}
          onTrackOrder={() => setShowOrderTracking(true)}
          onGoToCard={() => setPage(2)}
          onGoToCash={() => setPage(3)}
          onGoToBillSplitter={() => setPage(4)}
          onBankPayment={() => setShowBankPayment(true)}
        />,
        <EmptyStatePage config={{ ...marketplaceEmptyState, lightTheme: false }} isActive={!isDragging && page === 1} />,
        <EmptyStatePage config={{ ...cardEmptyState, lightTheme: false }} isActive={!isDragging && page === 2} />,
        <EmptyStatePage config={{ ...cashAssistEmptyState, lightTheme: true }} isActive={!isDragging && page === 3} />,
        <EmptyStatePage config={{ ...billSplitterEmptyState, lightTheme: true }} isActive={!isDragging && page === 4} />,
        <EmptyStatePage config={{ ...savingsEmptyState, lightTheme: true }} isActive={!isDragging && page === 5} />,
      ]
    : gradientTest
    ? [
        <AllContent
          data={data}
          cardAdopted={cardAdopted}
          hasOrder={data.hasOrder}
          hasTracking={data.hasTracking}
          onGoToMarketplace={() => setPage(1)}
          onTrackOrder={() => setShowOrderTracking(true)}
          onGoToCard={() => setPage(2)}
          onGoToCash={() => setPage(3)}
          onGoToBillSplitter={() => setPage(4)}
          onBankPayment={() => setShowBankPayment(true)}
        />,
        <GradientTestPage
          topLabel="Available Spending Limit"
          bigText={`$${mpStr[0]}`}
          dimSuffix={`.${mpStr[1]}`}
          totalLimit={data.spending.totalLimit}
          managementTitle="Card Management"
          managementItems={CARD_MGMT_LIST}
        />,
        <GradientTestPage
          topLabel="Available Credit Limit"
          bigText={`$${data.card.creditLimit.toLocaleString()}`}
          totalLimit={data.spending.totalLimit}
          managementTitle="Card Management"
          managementItems={CARD_MGMT_LIST}
        />,
        <GradientTestPage
          topLabel="Left to repay"
          bigText={`$${(data.cashAssist?.amount ?? 0).toLocaleString()}`}
          totalLimit={data.spending.totalLimit}
          managementTitle="Loan Management"
          managementItems={LOAN_MGMT_LIST}
          lightTheme={cashIsLight}
        />,
        <GradientTestPage
          topLabel="Bill Covered"
          bigText={`${data.billSplitter?.percentCovered ?? 0}`}
          dimSuffix="%"
          totalLimit={data.spending.totalLimit}
          managementTitle="Loan Management"
          managementItems={LOAN_MGMT_LIST}
          lightTheme={bsIsLight}
        />,
        <GradientTestPage
          topLabel="Available Cash"
          bigText="$534"
          totalLimit={data.spending.totalLimit}
          managementTitle="Loan Management"
          managementItems={LOAN_MGMT_LIST}
          /* v5 Savings uses the dark blue base so the hero needs white text. */
          lightTheme={!gradientV5}
        />,
      ]
    : [
        <AllContent
          data={data}
          cardAdopted={cardAdopted}
          hasOrder={data.hasOrder}
          hasTracking={data.hasTracking}
          onGoToMarketplace={() => setPage(1)}
          onTrackOrder={() => setShowOrderTracking(true)}
          onGoToCard={() => setPage(2)}
          onGoToCash={() => setPage(3)}
          onGoToBillSplitter={() => setPage(4)}
          onBankPayment={() => setShowBankPayment(true)}
        />,
        <MarketplaceContent data={data} hasOrder={data.hasOrder} onTrackOrder={() => setShowOrderTracking(true)} />,
        <CardContent
          onApply={handleApplyNow}
          cardAdopted={cardAdopted}
          creditLimit={data.card.creditLimit}
          data={data}
          onBankPayment={() => setShowBankPayment(true)}
          isActive={!isDragging && page === 2}
        />,
        <PlaceholderContent label="Cash Assist" />,
        <PlaceholderContent label="Bill Splitter" />,
        <PlaceholderContent label="Savings" />,
      ];

  return (
    <div ref={screenRef} className={styles.screen}>

      {/* ── Background: crossfade per page ──
       * In empty-states mode the outer bg paints a SHORT product gradient
       * (natural height, ~550px). This is the backdrop behind the fixed
       * chip bar plus the very top of content, so the chip bar always sits
       * over the correct product color.
       *
       * Each empty-state page ALSO paints its own gradient INSIDE its
       * scroller — that inner one scrolls up with content so the dark
       * portion visually shortens as the user scrolls. Both use the same
       * gradient image, so their top colors match at the chip-bar/content
       * seam and the two layers read as a single continuous surface. */}
      {emptyStates ? (
        <>
          <div
            className={`${styles.bgLayer} ${styles.bgLight}`}
            style={{ opacity: Math.max(0, 1 - darkProgress - cardProgress - cashProgress - billSplitterProgress - savingsProgress) }}
          />
          <div
            className={`${styles.bgLayer} ${styles.bgGradMarketplace} ${styles.bgLayerTallGradient}`}
            style={{ opacity: darkProgress, transition: easing }}
          />
          <div
            className={`${styles.bgLayer} ${styles.bgGradCard} ${styles.bgLayerTallGradient}`}
            style={{ opacity: cardProgress, transition: easing }}
          />
          <div
            className={`${styles.bgLayer} ${styles.bgGradCashV4} ${styles.bgLayerTallGradient}`}
            style={{ opacity: cashProgress, transition: easing }}
          />
          <div
            className={`${styles.bgLayer} ${styles.bgGradBillSplitterV6} ${styles.bgLayerTallGradient}`}
            style={{ opacity: billSplitterProgress, transition: easing }}
          />
          <div
            className={`${styles.bgLayer} ${styles.bgGradSavings} ${styles.bgLayerTallGradient}`}
            style={{ opacity: savingsProgress, transition: easing }}
          />
        </>
      ) : gradientTest ? (
        <>
          <div
            className={`${styles.bgLayer} ${styles.bgLight}`}
            style={{ opacity: Math.max(0, 1 - darkProgress - cardProgress - cashProgress - billSplitterProgress - savingsProgress), transition: easing }}
          />
          <div
            className={`${styles.bgLayer} ${styles.bgGradMarketplace}`}
            style={{ opacity: darkProgress, transition: easing }}
          />
          <div
            className={`${styles.bgLayer} ${styles.bgGradCard}`}
            style={{ opacity: cardProgress, transition: easing }}
          />
          <div
            className={`${styles.bgLayer} ${gradientV2 ? styles.bgGradCashV2 : gradientV3 ? styles.bgGradCashV3 : (gradientV4 || gradientV6) ? styles.bgGradCashV4 : gradientV5 ? styles.bgGradCashV5Base : styles.bgGradCash}`}
            style={{ opacity: cashProgress, transition: easing }}
          />
          <div
            className={`${styles.bgLayer} ${(gradientV2 || gradientV5) ? styles.bgGradBillSplitterV2 : gradientV6 ? styles.bgGradBillSplitterV6 : styles.bgGradBillSplitter}`}
            style={{ opacity: billSplitterProgress, transition: easing }}
          />
          <div
            className={`${styles.bgLayer} ${gradientV5 ? styles.bgGradSavingsV5Base : styles.bgGradSavings}`}
            style={{ opacity: savingsProgress, transition: easing }}
          />
          {hasGlowLayers && (
            <>
              {/* Glow layers fade in later in the swipe than the cards do —
                  a cubic curve keeps opacity low for the first half and
                  ramps up steeply at the end, so the halo lands just as
                  the cards finish settling. */}
              {gradientV5 && (
                <>
                  <div
                    className={`${styles.bgLayer} ${styles.bgGradMarketplaceV5Glow}`}
                    style={{ opacity: Math.pow(darkProgress, 3), transition: easing }}
                  />
                  <div
                    className={`${styles.bgLayer} ${styles.bgGradCardV5Glow}`}
                    style={{ opacity: Math.pow(cardProgress, 3), transition: easing }}
                  />
                </>
              )}
              <div
                className={`${styles.bgLayer} ${gradientV5 ? styles.bgGradCashV5Glow : styles.bgGradCashGlow}`}
                style={{ opacity: Math.pow(cashProgress, 3), transition: easing }}
              />
              <div
                className={`${styles.bgLayer} ${styles.bgGradBillSplitterGlow}`}
                style={{ opacity: Math.pow(billSplitterProgress, 3), transition: easing }}
              />
              {gradientV5 && (
                <div
                  className={`${styles.bgLayer} ${styles.bgGradSavingsV5Glow}`}
                  style={{ opacity: Math.pow(savingsProgress, 3), transition: easing }}
                />
              )}
            </>
          )}
        </>
      ) : (
        <>
          <div
            className={`${styles.bgLayer} ${styles.bgLight}`}
            style={{ opacity: Math.max(0, 1 - darkProgress - cardProgress), transition: easing }}
          />
          <div
            className={`${styles.bgLayer} ${styles.bgDark}`}
            style={{ opacity: darkProgress, transition: easing }}
          />
          <div
            className={`${styles.bgLayer} ${cardAdopted ? styles.bgCardAdopted : styles.bgCard}`}
            style={{ opacity: cardProgress, transition: easing }}
          />
        </>
      )}

      {/* ── Fixed header: pinned, never scrolls ── */}
      <div className={styles.fixedHeader}>
        <div className={styles.headerRow}>
          <div
            className={styles.avatar}
            style={isDark ? { background: 'rgba(255,255,255,0.18)' } : undefined}
          >
            <span className={styles.avatarInitials} style={{ color: isDark ? '#fff' : '#2e71ea' }}>
              {data.user.initials}
            </span>
          </div>
          <div className={styles.headerActions}>
            <img src={isDark ? A.bellDark : A.bellLight} alt="" className={styles.bellIcon} />
            <div className={styles.cartWrapper}>
              <img src={isDark ? A.cartDark : A.cartLight} alt="" className={styles.cartIcon} />
              <span className={styles.cartBadge}>{data.user.cartCount}</span>
            </div>
          </div>
        </div>
        <ChipBar
          pageIndex={page}
          isDark={isDark}
          onSelect={(i) => setPage(i)}
          notifs={chipNotifs}
          swipeProgress={screenW > 0 ? -clampedX / screenW : 0}
          isDragging={isDragging}
        />
      </div>

      {/* ── Content track: only this slides ── */}
      <div
        className={styles.contentTrack}
        style={{
          transform: `translateX(${clampedX}px)`,
          transition: isDragging ? 'none' : 'transform 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          width: `${PAGE_COUNT * screenW}px`,
        }}
      >
        {pages.map((content, i) => (
          <div
            key={i}
            className={styles.page}
            style={{
              width: `${screenW}px`,
              opacity: pageOpacity(i),
              transition: easing,
            }}
          >
            {content}
          </div>
        ))}
      </div>

      <BottomNav onShopOpen={() => setActiveNav('shop')} />

      <ShopOverlay show={activeNav === 'shop'} onBack={() => setActiveNav('home')} />

      <OrderTrackingOverlay
        data={data}
        show={showOrderTracking}
        onBack={() => setShowOrderTracking(false)}
      />

      <CardApplyingOverlay show={showCardApplying} />
      <CardApprovalOverlay show={showCardApproval} onBack={handleApprovalBack} />

      {showBankPayment && (
        <BankPaymentScreen
          amount={data.card.currentBalance}
          onBack={() => setShowBankPayment(false)}
        />
      )}
    </div>
  );
}
