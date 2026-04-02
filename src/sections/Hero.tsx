import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { Theme } from '../hooks/useTheme'
import { pal } from '../utils/palette'

// ── Types ─────────────────────────────────────────────────────────────────────

interface HeroProps {
    theme: Theme
    onRocketClick: () => void
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Hero section — full-viewport landing with:
 * - Large "Stryer" display type (Playfair Display)
 * - Floating rocket that replays the intro animation on click
 * - Parallax fade-out on scroll
 * - Name + role subtitle below a divider line
 */
export default function Hero({ theme, onRocketClick }: HeroProps) {
    const isDark = theme === 'dark'
    const p = pal(isDark)
    const sectionRef = useRef<HTMLElement>(null)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    })
    const rocketOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
    const rocketY = useTransform(scrollYProgress, [0, 0.25], [0, -40])

    return (
        <>
            <style>{`
                /* ── Rocket ── */
                .rocket-wrap {
                    position: relative;
                    display: inline-flex;
                    flex-direction: column;
                    align-items: center;
                }
                .rocket-img {
                    width: 130px;
                    height: 130px;
                }
                .rocket-label {
                    margin-top: 10px;
                    font-size: 9px;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    opacity: 0;
                    transition: opacity 220ms ease;
                    pointer-events: none;
                    font-family: 'DM Mono', monospace;
                    white-space: nowrap;
                }
                .rocket-wrap:hover .rocket-label { opacity: 1; }

                /* ── Hero title ── */
                .hero-title {
                    font-size: clamp(120px, 17.5vw, 256px);
                }
                .hero-title-spacer {
                    padding-top: clamp(120px, 17.5vw, 256px);
                }

                /* ── Subtitle ── */
                .hero-subtitle-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                .hero-name { font-size: 11px; }
                .hero-role { font-size: 10px; }
                .hero-bottom {
                    padding: 0 44px 36px;
                }

                /* ── Mobile overrides ── */
                @media (max-width: 640px) {
                    .rocket-img {
                        width: 110px !important;
                        height: 110px !important;
                    }
                    .rocket-label {
                        opacity: 0.45 !important;
                        font-size: 8px !important;
                    }
                    .hero-title {
                        font-size: 22vw !important;
                    }
                    .hero-title-spacer {
                        padding-top: 22vw !important;
                    }
                    .hero-bottom {
                        padding: 0 24px 36px !important;
                    }
                    .hero-subtitle-row {
                        flex-direction: column !important;
                        gap: 4px !important;
                    }
                    .hero-name { font-size: 10px !important; }
                    .hero-role { font-size: 9px !important; }
                }
            `}</style>

            <section
                id="hero"
                ref={sectionRef}
                style={{
                    position: 'relative',
                    height: '100svh',
                    minHeight: 560,
                    background: p.bg,
                    color: p.fg,
                    fontFamily: '"DM Sans", sans-serif',
                    transition: 'background 0.4s ease, color 0.4s ease',
                    overflow: 'hidden',
                }}
            >
                {/* ── Rocket (centered, shifted up slightly) ── */}
                <motion.div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: rocketOpacity,
                        y: rocketY,
                        zIndex: 5,
                        pointerEvents: 'none',
                        paddingBottom: '10vh',
                    }}
                >
                    <div className="rocket-wrap" style={{ pointerEvents: 'auto' }}>
                        <motion.img
                            className="rocket-img"
                            src={isDark
                                ? `${import.meta.env.BASE_URL}NaveBlanca.png`
                                : `${import.meta.env.BASE_URL}NaveNegra.png`}
                            alt="Rocket — click to replay intro"
                            onClick={(e) => { e.stopPropagation(); onRocketClick() }}
                            style={{
                                objectFit: 'contain',
                                userSelect: 'none',
                                cursor: 'pointer',
                                opacity: 0.85,
                                display: 'block',
                            }}
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            draggable={false}
                        />
                        <span className="rocket-label" style={{ color: p.mid }}>
                            ↺ click to replay
                        </span>
                    </div>
                </motion.div>

                {/* ── Bottom block ── */}
                <div
                    className="hero-bottom"
                    style={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0,
                        zIndex: 6,
                    }}
                >
                    <div style={{ position: 'relative' }}>
                        {/* Display title */}
                        <motion.h1
                            className="hero-title"
                            initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
                            animate={{ clipPath: 'inset(0 0 -30% 0)', opacity: 1 }}
                            transition={{ duration: 1.0, ease: EASE, delay: 0.1 }}
                            style={{
                                position: 'absolute',
                                bottom: 1,
                                left: 0,
                                zIndex: 2,
                                fontWeight: 400,
                                letterSpacing: '-0.01em',
                                lineHeight: 1,
                                margin: 0,
                                fontFamily: '"Playfair Display", Georgia, serif',
                                color: p.fg,
                                userSelect: 'none',
                                transition: 'color 0.4s ease',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Stryer
                        </motion.h1>

                        {/* Spacer + divider */}
                        <motion.div
                            className="hero-title-spacer"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.1, ease: 'easeOut', delay: 0.45 }}
                            style={{ position: 'relative', zIndex: 1 }}
                        >
                            <div style={{
                                height: 1,
                                background: p.rule,
                                transformOrigin: 'left',
                                transition: 'background 0.4s ease',
                            }} />
                        </motion.div>
                    </div>

                    {/* Subtitle */}
                    <motion.div
                        className="hero-subtitle-row"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.75 }}
                        style={{ marginTop: 12 }}
                    >
                        <span className="hero-name" style={{
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            color: p.muted,
                            transition: 'color 0.4s ease',
                        }}>
                            Alexandro Stryer Díaz
                        </span>
                        <span className="hero-role" style={{
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: p.muted,
                            transition: 'color 0.4s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                        }}>
                            <span style={{
                                width: 4, height: 4, borderRadius: '50%',
                                background: p.blue, flexShrink: 0, opacity: 0.6,
                            }} />
                            Software Engineer · Full-Stack
                        </span>
                    </motion.div>
                </div>
            </section>
        </>
    )
}