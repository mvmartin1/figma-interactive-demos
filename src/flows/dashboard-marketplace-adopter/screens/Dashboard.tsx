import { useState, useRef, useEffect } from 'react';
import { useScenario } from '@/lib/scenario-context';
import type { DashboardData } from '../scenarios';
import styles from './Dashboard.module.css';
import marketplacePromoImg from '../assets/marketplace-promo.png';
import creditCardPromoImg from '../assets/credit-card-promo.png';
import creditCardHeroImg from '../assets/credit-card-hero.png';
import smallCardImg from '../assets/small-card.png';

const A = {
  statusIconsLight: 'https://www.figma.com/api/mcp/asset/ca9e9def-f65c-4160-b2c5-54a28bf59f70',
  avatarLight: 'https://www.figma.com/api/mcp/asset/81b067db-a74c-4d9f-86f2-ccdeb7a6f9ed',
  bellLight: 'https://www.figma.com/api/mcp/asset/15c67016-c195-4d72-aa96-0e59e5ec0b3b',
  cartLight: 'https://www.figma.com/api/mcp/asset/be347575-7c0e-4209-bebc-2e73e17c2891',
  chipDotLight: 'https://www.figma.com/api/mcp/asset/5f5feaf7-8093-43dd-9ea6-a10d4286c18d',
  mpIcon: 'https://www.figma.com/api/mcp/asset/f0791ce3-86f9-465f-9a48-8988bb16f144',
  trackIllus: 'https://www.figma.com/api/mcp/asset/e6e44f41-500c-47c2-bf4e-ecaafe6b98fb',
  creditGraphMask: 'https://www.figma.com/api/mcp/asset/4fa163ef-1057-45d6-842d-962467cf974b',
  airpods: 'https://www.figma.com/api/mcp/asset/7653d988-acbc-4d94-ac36-b3e0eb8304a6',
  perpayLogoWhite: 'https://www.figma.com/api/mcp/asset/bef39456-12a7-4349-8cff-b3c33ef61f63',
  statusIconsDark: 'https://www.figma.com/api/mcp/asset/499baf44-6aad-4d18-a622-9dada11d008e',
  avatarDark: 'https://www.figma.com/api/mcp/asset/155c405b-f0dd-4c00-959c-1a402b59c0eb',
  bellDark: 'https://www.figma.com/api/mcp/asset/0274cc20-639b-4a72-a73b-cefc562bc4b2',
  cartDark: 'https://www.figma.com/api/mcp/asset/c91ff87a-afa6-44bb-9b6b-fe36826dc008',
  chipDotDark: 'https://www.figma.com/api/mcp/asset/ee8a5793-df01-43a3-aefc-966da80c00b2',
  utilizationFill: 'https://www.figma.com/api/mcp/asset/62b6bcf7-61e0-47d5-9e9d-98577b9dfe0e',
  polygonUp: 'https://www.figma.com/api/mcp/asset/a0154774-d8c2-4059-ae27-7df033418cc6',
  paymentIcon: 'https://www.figma.com/api/mcp/asset/b0748392-7562-4057-b9a8-ffc8c695efae',
  checkIcon: 'https://www.figma.com/api/mcp/asset/d3cede26-3a1f-4a02-aae6-09d2be4553b2',
  appleLogo: 'https://www.figma.com/api/mcp/asset/09f47101-60c7-4f99-a557-b55d4d84040f',
  brandLogo2: 'https://www.figma.com/api/mcp/asset/90d05dda-25c2-4fe4-bf76-f1bcbb6f2144',
  brandLogo3: 'https://www.figma.com/api/mcp/asset/5b23980e-3a2c-4c12-ab38-0af44bfc1a01',
  appleLogo2: 'https://www.figma.com/api/mcp/asset/00587614-6417-4417-93d3-955fb30d745d',
  kitchenaid: 'https://www.figma.com/api/mcp/asset/97788f12-fd9e-4aa9-b358-77fb9cfc5ec8',
  otProductThumb: 'https://www.figma.com/api/mcp/asset/85fc4cd3-e5f6-4fe4-9ada-616f042cdada',
  otCheckmark: 'https://www.figma.com/api/mcp/asset/8678ef32-9f89-4639-b1e0-341e9729c07d',
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
  { key: 'marketplace', label: 'Marketplace', hasNotif: true },
  { key: 'card', label: 'Card' },
  { key: 'cash', label: 'Cash' },
  { key: 'billpay', label: 'Bill Pay' },
  { key: 'savings', label: 'Savings' },
] as const;
const PAGE_COUNT = CHIPS.length;

// Deliberate thresholds — requires intent, not accidental brushes
const SWIPE_THRESHOLD = 60;       // px for slow swipe
const VELOCITY_THRESHOLD = 0.45;  // px/ms for fast flick
const MIN_VELOCITY_DIST = 25;     // min px even for fast flick

// ─── Chip bar ────────────────────────────────────────────────────────────────

type ChipBarProps = {
  pageIndex: number;
  isDark: boolean;
  onSelect: (i: number) => void;
};

function ChipBar({ pageIndex, isDark, onSelect }: ChipBarProps) {
  return (
    <div className={styles.chipBar}>
      {CHIPS.map((c, i) => {
        const isSelected = i === pageIndex;
        const chipClass = isSelected
          ? (isDark ? styles.chipSelectedDark : styles.chipSelected)
          : isDark
          ? styles.chipUnselectedDark
          : styles.chipUnselectedLight;
        return (
          <div key={c.key} className={styles.chipWrapper}>
            <button className={`${styles.chip} ${chipClass}`} onClick={() => onSelect(i)}>
              {c.label}
            </button>
            {'hasNotif' in c && c.hasNotif && !isSelected && (
              <img
                src={isDark ? A.chipDotDark : A.chipDotLight}
                alt=""
                className={styles.chipNotifDot}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── All page content ────────────────────────────────────────────────────────

function AllContent({ data, cardAdopted, hasOrder, onGoToMarketplace, onTrackOrder, onGoToCard, onGoToCash, onOpenShop }: {
  data: DashboardData;
  cardAdopted: boolean;
  hasOrder: boolean;
  onGoToMarketplace: () => void;
  onTrackOrder: () => void;
  onGoToCard: () => void;
  onGoToCash: () => void;
  onOpenShop: () => void;
}) {
  return (
    <div className={styles.pageContent}>

      {/* ── Top product cards ── */}
      <div className={styles.cardGroup}>
        {cardAdopted ? (
          <div className={styles.mpCcCardContainer}>
            {/* Marketplace row */}
            <div
              className={styles.cardContent}
              style={{ cursor: 'pointer', borderBottom: '1px solid #e9eef5' }}
              onClick={onGoToMarketplace}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onGoToMarketplace()}
            >
              <div className={styles.mpCardTop} style={{ marginBottom: hasOrder ? 16 : 0 }}>
                <div className={styles.mpCardLeft}>
                  <div className={styles.mpCardIcon}>
                    <img src={A.mpIcon} alt="" className={styles.mpCardIconImg} />
                  </div>
                  <span className={styles.mpCardTitle}>Marketplace</span>
                </div>
                <div className={styles.mpCardRight}>
                  <div className={styles.mpCardAmountRow}>
                    <span className={styles.mpCardAmount}>${data.spending.marketplaceAvailable.toLocaleString()}</span>
                    <span className={styles.mpCardAmountSub}>Available</span>
                  </div>
                  <ChevronRight size={18} color="#113355" />
                </div>
              </div>
              {hasOrder && (
                <div className={styles.trackOrderStrip}>
                  <img src={A.trackIllus} alt="" className={styles.trackIllusImg} />
                  <button
                    className={styles.trackOrderLink}
                    onClick={(e) => { e.stopPropagation(); onTrackOrder(); }}
                  >
                    Track order <ArrowRight size={18} color="#2e71ea" />
                  </button>
                </div>
              )}
            </div>
            {/* Credit Card row */}
            <div
              className={styles.cardContent}
              style={{ cursor: 'pointer' }}
              onClick={onGoToCard}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onGoToCard()}
            >
              <div className={styles.mpCardTop} style={{ marginBottom: 16 }}>
                <div className={styles.mpCardLeft}>
                  <div className={styles.mpCardIcon}>
                    <img src={A.mpIcon} alt="" className={styles.mpCardIconImg} />
                  </div>
                  <span className={styles.mpCardTitle}>Credit Card</span>
                </div>
                <div className={styles.mpCardRight}>
                  <div className={styles.mpCardAmountRow}>
                    <span className={styles.mpCardAmount}>$1,500</span>
                    <span className={styles.mpCardAmountSub}>Available</span>
                  </div>
                  <ChevronRight size={18} color="#113355" />
                </div>
              </div>
              <div className={styles.trackCardStrip}>
                <img src={smallCardImg} alt="" className={styles.miniCard} />
                <button
                  className={styles.trackOrderLink}
                  onClick={(e) => { e.stopPropagation(); onGoToCard(); }}
                >
                  Track Card <ArrowRight size={18} color="#2e71ea" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              className={styles.card}
              style={{ cursor: 'pointer' }}
              onClick={onGoToMarketplace}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onGoToMarketplace()}
              aria-label="Open Marketplace details"
            >
              <div className={styles.cardContent}>
                <div className={styles.mpCardTop} style={{ marginBottom: hasOrder ? 16 : 0 }}>
                  <div className={styles.mpCardLeft}>
                    <div className={styles.mpCardIcon}>
                      <img src={A.mpIcon} alt="" className={styles.mpCardIconImg} />
                    </div>
                    <span className={styles.mpCardTitle}>Marketplace</span>
                  </div>
                  <div className={styles.mpCardRight}>
                    <div className={styles.mpCardAmountRow}>
                      <span className={styles.mpCardAmount}>${data.spending.marketplaceAvailable.toLocaleString()}</span>
                      <span className={styles.mpCardAmountSub}>Available</span>
                    </div>
                    <ChevronRight size={18} color="#113355" />
                  </div>
                </div>
                {hasOrder && (
                  <div className={styles.trackOrderStrip}>
                    <img src={A.trackIllus} alt="" className={styles.trackIllusImg} />
                    <button
                      className={styles.trackOrderLink}
                      onClick={(e) => { e.stopPropagation(); onTrackOrder(); }}
                    >
                      Track order <ArrowRight size={18} color="#2e71ea" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {!hasOrder && (
              <div
                className={styles.cardDashed}
                style={{ cursor: 'pointer' }}
                onClick={onOpenShop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onOpenShop()}
              >
                <div className={styles.dashedCardRow}>
                  <div className={styles.dashedCardLeft}>
                    <div className={styles.mpCardIcon}><img src={A.mpIcon} alt="" className={styles.mpCardIconImg} /></div>
                    <span className={styles.dashedCardTitle}>Browse the Marketplace</span>
                  </div>
                  <ChevronRight size={18} color="#9aa3b2" />
                </div>
              </div>
            )}
            <div
              className={styles.cardDashed}
              style={{ cursor: 'pointer' }}
              onClick={onGoToCard}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onGoToCard()}
            >
              <div className={styles.dashedCardRow}>
                <div className={styles.dashedCardLeft}>
                  <div className={styles.mpCardIcon}><img src={A.mpIcon} alt="" className={styles.mpCardIconImg} /></div>
                  <span className={styles.dashedCardTitle}>Check Card Eligibility</span>
                </div>
                <ChevronRight size={18} color="#9aa3b2" />
              </div>
            </div>
          </>
        )}

        {(hasOrder || cardAdopted) && (
          <div
            className={styles.cardDashed}
            style={{ cursor: 'pointer' }}
            onClick={onGoToCash}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onGoToCash()}
          >
            <div className={styles.dashedCardRow}>
              <div className={styles.dashedCardLeft}>
                <div className={styles.mpCardIcon}><img src={A.mpIcon} alt="" className={styles.mpCardIconImg} /></div>
                <span className={styles.dashedCardTitle}>Get up to $500 in cash</span>
              </div>
              <ChevronRight size={18} color="#9aa3b2" />
            </div>
          </div>
        )}
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
              <div className={styles.mpL2BarFill} style={{ width: fillWidth }}>
                <img src={A.utilizationFill} alt="" className={styles.mpL2BarFillImg} />
              </div>
            </div>
            <div className={styles.mpL2CurrentMarker} style={{ left: `${balancePct}%` }}>
              <span className={styles.mpL2MarkerLabel}>${data.spending.currentBalance}</span>
              <img src={A.polygonUp} alt="" className={styles.mpL2MarkerTriangle} />
            </div>
            <span className={styles.mpL2MaxLabel}>${data.spending.totalLimit}</span>
          </div>
        </div>
      </div>

      <div className={styles.favoritesRow}>
        <div className={styles.favoritesCard}>
          <div className={styles.favBrandLogos}>
            <div className={styles.favBrandLogo}><img src={A.appleLogo} alt="" className={styles.favBrandLogoImg} /></div>
            <div className={styles.favBrandLogo}><img src={A.brandLogo2} alt="" className={styles.favBrandLogoImg} /></div>
            <div className={styles.favBrandLogo}><img src={A.brandLogo3} alt="" className={styles.favBrandLogoImg} /></div>
          </div>
          <span className={styles.favLabel}>Your Favorites</span>
        </div>
        <div className={styles.favoritesCard}>
          <div className={styles.favBrandLogos}>
            <div className={styles.favBrandLogo}><img src={A.appleLogo2} alt="" className={styles.favBrandLogoImg} /></div>
            <div className={styles.favBrandLogo} style={{ background: '#b42c2c' }}><img src={A.kitchenaid} alt="" className={styles.favBrandLogoImg} style={{ filter: 'brightness(5)' }} /></div>
            <div className={styles.favBrandLogo}><img src={A.brandLogo3} alt="" className={styles.favBrandLogoImg} /></div>
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
                    <img src={A.paymentIcon} alt="" className={styles.paymentIconImg} />
                  </div>
                  <div>
                    <div className={styles.paymentName}>Next paycheck</div>
                    <div className={styles.paymentSub}>Direct deposit payment</div>
                  </div>
                </div>
                <span className={styles.paymentAmount}>${data.payments.nextPaycheckAmount.toFixed(2)}</span>
              </div>
              <div className={styles.paymentCoversBadge}>
                <img src={A.checkIcon} alt="" className={styles.paymentCoversBadgeIcon} />
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

const CARD_BENEFITS = [
  { label: 'Increased credit limits', sub: 'in as little as 3 months' },
  { label: 'Build credit', sub: 'with automatic payment* from your direct deposit' },
  { label: '2% rewards', sub: 'on every payment you make' },
];

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

function CardContent({ onApply, cardAdopted, creditLimit }: {
  onApply: () => void;
  cardAdopted: boolean;
  creditLimit: number;
}) {
  if (cardAdopted) return <CardAdoptedContent creditLimit={creditLimit} />;

  return (
    <div className={styles.cardPageContent}>

      <div className={styles.cardHero}>
        <h2 className={styles.cardHeroTitle}>Finally, a card that works for you</h2>
        <p className={styles.cardHeroSubtitle}>Expand your spending power and get up to a $1,500 Credit Limit</p>
        <button className={styles.cardApplyBtn} onClick={onApply}>Apply now</button>
      </div>

      <div className={styles.cardImgSection}>
        <img src={creditCardHeroImg} alt="Perpay Credit Card" className={styles.cardHeroImg} />
      </div>

      <div className={styles.cardBenefitsSection}>
        <p className={styles.cardBenefitsTitle}>Benefits</p>
        <div className={styles.cardBenefitCard}>
          {CARD_BENEFITS.map((b, i) => (
            <div key={b.label}>
              {i > 0 && <div className={styles.cardBenefitDivider} />}
              <div className={styles.cardBenefitItem}>
                <div className={styles.cardBenefitIconWrap}>
                  <CheckLineIcon />
                </div>
                <div className={styles.cardBenefitText}>
                  <span className={styles.cardBenefitLabel}>{b.label}</span>
                  <span className={styles.cardBenefitSub}>{b.sub}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
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
                <img src={A.otCheckmark} className={styles.otCheckIcon} alt="" />
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
  const [cardAdopted, setCardAdopted] = useState(data.card.adopted);
  const [showCardApplying, setShowCardApplying] = useState(false);
  const [showCardApproval, setShowCardApproval] = useState(false);
  const [activeNav, setActiveNav] = useState<'home' | 'shop'>('home');

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

  // darkProgress peaks at 1 when on Marketplace (index 1)
  const darkProgress = Math.max(0, Math.min(1, 1 - Math.abs(clampedX + screenW) / screenW));
  // cardProgress peaks at 1 when on Card (index 2)
  const cardProgress = Math.max(0, Math.min(1, 1 - Math.abs(clampedX + 2 * screenW) / screenW));

  const isDark = darkProgress > 0.5 || cardProgress > 0.5;
  const easing = isDragging ? 'none' : 'opacity 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';

  // Per-page opacity: fades in when adjacent to current swipe position
  const pageOpacity = (i: number) =>
    Math.max(0, 1 - Math.abs(clampedX + i * screenW) / screenW);

  const pages = [
    <AllContent
      data={data}
      cardAdopted={cardAdopted}
      hasOrder={data.hasOrder}
      onGoToMarketplace={() => setPage(1)}
      onTrackOrder={() => setShowOrderTracking(true)}
      onGoToCard={() => setPage(2)}
      onGoToCash={() => setPage(3)}
      onOpenShop={() => setActiveNav('shop')}
    />,
    <MarketplaceContent data={data} hasOrder={data.hasOrder} onTrackOrder={() => setShowOrderTracking(true)} />,
    <CardContent onApply={handleApplyNow} cardAdopted={cardAdopted} creditLimit={data.card.creditLimit} />,
    <PlaceholderContent label="Cash" />,
    <PlaceholderContent label="Bill Pay" />,
    <PlaceholderContent label="Savings" />,
  ];

  return (
    <div ref={screenRef} className={styles.screen}>

      {/* ── Background: crossfade between light, Marketplace blue, and Card dark ── */}
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
    </div>
  );
}
