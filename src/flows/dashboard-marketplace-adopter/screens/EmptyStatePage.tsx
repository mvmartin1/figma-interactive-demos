import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './EmptyStatePage.module.css';
import cardFront from '../assets/empty-state/card-front.png';
import cardBack from '../assets/empty-state/card-back.png';
import laurelLeft from '../assets/empty-state/laurel-left.svg';
import laurelRight from '../assets/empty-state/laurel-right.svg';
import starsHeader from '../assets/empty-state/stars-header.svg';
import stars5 from '../assets/empty-state/stars-5.svg';

// ─── Types ─────────────────────────────────────────────────────────────

export type EmptyStateBenefit = {
  icon: ReactNode;
  label: string;
  sub: string;
};

export type EmptyStateTestimonial = {
  title: string;
  body: string;
  author: string;
};

export type EmptyStateConfig = {
  // Background gradient (per-product). Painted INSIDE the scroll container
  // so it scrolls up with content — matches Figma where the dark band
  // slides away instead of staying pinned to the top of the phone frame.
  gradientImage: string;
  headline: {
    prefix: string;
    tickerFrom: number;
    tickerTo: number;
    suffix: string;
    // "money" formats with a thousands comma (default); "plain" is bare digits (percent).
    format?: 'money' | 'plain';
  };
  subhead: string;
  benefits: EmptyStateBenefit[];
  rating?: {
    value: string;
    source: string;
  };
  testimonials?: EmptyStateTestimonial[];
  featuredOn?: string[];
  ctaLabel: string;
  onCta?: () => void;
  cards?: {
    front: string;
    back: string;
  };
  lightTheme?: boolean;
  // CTA background color. Defaults to the brand (bg-brand) semantic token;
  // set to 'black' for the Card page which uses a solid black button.
  ctaColor?: 'brand' | 'black';
};

type Props = {
  config: EmptyStateConfig;
  isActive: boolean;
};

// ─── Ticker: per-digit slot-machine flip ───────────────────────────────
//
// Each digit position renders a vertical 0–9 reel; a translateY selects
// the visible digit. When `isActive` becomes true, each reel transitions
// from its "from" digit to its "to" digit — only positions whose digits
// actually change end up moving. Leading padded zeros in `from` stay
// invisible until they need to reveal a non-zero target digit.

function TickerDigit({
  from,
  to,
  isActive,
  delayMs,
  hideUntilActive,
}: {
  from: number;
  to: number;
  isActive: boolean;
  delayMs: number;
  hideUntilActive: boolean;
}) {
  const [value, setValue] = useState(from);
  const [revealed, setRevealed] = useState(!hideUntilActive);

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => {
      setValue(to);
      if (hideUntilActive) setRevealed(true);
    }, delayMs);
    return () => clearTimeout(t);
  }, [isActive, to, delayMs, hideUntilActive]);

  return (
    <span
      className={styles.tickerDigit}
      style={{
        opacity: revealed ? 1 : 0,
        transition: 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <span
        className={styles.tickerReel}
        style={{ transform: `translateY(-${value}em)` }}
      >
        {Array.from({ length: 10 }, (_, d) => (
          <span key={d} className={styles.tickerCell}>
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

// Delay after `isActive` before the ticker starts playing — a short beat so
// the page lands cleanly before the digits begin flipping.
const TICKER_START_DELAY_MS = 250;

function Ticker({
  from,
  to,
  isActive,
  format = 'money',
}: {
  from: number;
  to: number;
  isActive: boolean;
  format?: 'money' | 'plain';
}) {
  // Latch: once the ticker has been activated (page settled), the comma
  // should stay visible even when the user swipes away and back. Without
  // this, driving comma opacity off `isActive` directly means the comma
  // fades out every time the page loses focus.
  const [hasActivated, setHasActivated] = useState(false);
  useEffect(() => {
    if (isActive) setHasActivated(true);
  }, [isActive]);

  const digitCount = String(Math.max(from, to)).length;
  const fromPad = String(from).padStart(digitCount, '0');
  const toPad = String(to).padStart(digitCount, '0');

  const parts: ReactNode[] = [];
  for (let i = 0; i < digitCount; i++) {
    const posFromRight = digitCount - 1 - i;
    if (
      format === 'money' &&
      posFromRight > 0 &&
      (posFromRight + 1) % 3 === 0 &&
      i > 0
    ) {
      const commaVisibleFromStart = from > Math.pow(10, posFromRight + 1) - 1;
      parts.push(
        <span
          key={`sep-${i}`}
          className={styles.tickerSeparator}
          style={{
            opacity: commaVisibleFromStart || hasActivated ? 1 : 0,
            transition: 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDelay: `${TICKER_START_DELAY_MS + i * 40}ms`,
          }}
        >
          ,
        </span>,
      );
    }
    const fromDigit = Number(fromPad[i]);
    const toDigit = Number(toPad[i]);
    const hideUntilActive =
      i < digitCount - String(from).length && fromDigit === 0;
    parts.push(
      <TickerDigit
        key={`d-${i}`}
        from={fromDigit}
        to={toDigit}
        isActive={isActive}
        delayMs={TICKER_START_DELAY_MS + i * 60}
        hideUntilActive={hideUntilActive}
      />,
    );
  }

  return <span className={styles.ticker}>{parts}</span>;
}

// ─── Component ────────────────────────────────────────────────────────

export default function EmptyStatePage({ config, isActive }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const p = Math.max(0, Math.min(1, el.scrollTop / 180));
      setScrollProgress(p);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Cards start fully overlapped and highly rotated (like a fanned deck
  // pinched at the center), then fan out slightly on scroll — the scrolled
  // position matches what used to be the un-scrolled state, per the Figma.
  const frontTransform = (() => {
    const tx = -6 * scrollProgress;                // 0 → −6px
    const rot = -14 + 6 * scrollProgress;          // −14° → −8°
    return `translate(calc(-50% + ${tx}px), -50%) rotate(${rot}deg)`;
  })();
  const backTransform = (() => {
    const tx = 6 * scrollProgress;                 // 0 → +6px
    const rot = 14 - 6 * scrollProgress;           // +14° → +8°
    return `translate(calc(-50% + ${tx}px), -50%) rotate(${rot}deg)`;
  })();

  const cards = config.cards ?? { front: cardFront, back: cardBack };
  const light = config.lightTheme === true;

  return (
    <div className={styles.page}>
      <div ref={scrollRef} className={styles.scroll}>
        {/* Hero */}
        <div className={styles.hero}>
          <h2 className={`${styles.headline} ${light ? styles.headlineLight : ''}`}>
            {config.headline.prefix}
            <Ticker
              from={config.headline.tickerFrom}
              to={config.headline.tickerTo}
              isActive={isActive}
              format={config.headline.format ?? 'money'}
            />
            {config.headline.suffix}
          </h2>
          <p className={`${styles.subhead} ${light ? styles.subheadLight : ''}`}>
            {config.subhead}
          </p>
        </div>

        {/* Card stack — sits below hero, and the benefits card below it
            overlaps its lower edge via negative margin so the cards appear
            to go UNDER the benefits card in depth. */}
        <div className={styles.cardStack}>
          <img
            src={cards.back}
            alt=""
            className={styles.cardBack}
            style={{ transform: backTransform }}
          />
          <img
            src={cards.front}
            alt=""
            className={styles.cardFront}
            style={{ transform: frontTransform }}
          />
        </div>

        {/* Benefits (visually overlaps cards' bottom via negative margin) */}
        <div className={styles.benefitsCard}>
          {config.benefits.map((b) => (
            <div key={b.label} className={styles.benefitRow}>
              <div className={styles.benefitIconWrap}>{b.icon}</div>
              <div className={styles.benefitText}>
                <span className={styles.benefitLabel}>{b.label}</span>
                <span className={styles.benefitSub}>{b.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Star rating (white card with laurels flanking the center stack) */}
        {config.rating && (
          <div className={styles.ratingCard}>
            <img src={laurelLeft} alt="" className={styles.laurel} />
            <div className={styles.ratingCenter}>
              <img src={starsHeader} alt="" className={styles.ratingStars} />
              <span className={styles.ratingValue}>{config.rating.value} Stars</span>
              <span className={styles.ratingSource}>{config.rating.source}</span>
            </div>
            <img src={laurelRight} alt="" className={styles.laurel} />
          </div>
        )}

        {/* Testimonials */}
        {config.testimonials && config.testimonials.length > 0 && (
          <div className={styles.testimonials}>
            {config.testimonials.map((t, i) => (
              <div key={`${t.author}-${i}`} className={styles.testimonial}>
                <div className={styles.testimonialHeader}>
                  <span className={styles.testimonialTitle}>"{t.title}"</span>
                  <img src={stars5} alt="" className={styles.testimonialStars} />
                </div>
                <p className={styles.testimonialBody}>{t.body}</p>
                <span className={styles.testimonialAuthor}>{t.author}</span>
              </div>
            ))}
          </div>
        )}

        {/* Featured on */}
        {config.featuredOn && config.featuredOn.length > 0 && (
          <div className={styles.featuredOn}>
            <span className={styles.featuredLabel}>Featured on</span>
            <div className={styles.featuredLogos}>
              {config.featuredOn.map((name) => (
                <div key={name} className={styles.featuredLogo}>
                  {name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Apply CTA */}
      <div className={styles.ctaWrap}>
        <button
          className={`${styles.cta} ${config.ctaColor === 'black' ? styles.ctaBlack : ''}`}
          onClick={config.onCta}
        >
          {config.ctaLabel}
        </button>
      </div>
    </div>
  );
}
