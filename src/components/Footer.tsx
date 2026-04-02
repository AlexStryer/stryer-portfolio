import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Theme } from '../hooks/useTheme'

interface FooterProps {
    theme: Theme
}

const GLYPHS = '░▒▓█╬═╦╠╩01!@#$%&?'
const SECRET = 'Built with ☕ & too many late nights'

const NAV_LINKS = [
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
]

const SOCIALS = [
    { label: 'GitHub', href: 'https://github.com/AlexStryer' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alexandro-stryer-diaz/' },
]

function pal(isDark: boolean) {
    return {
        bg: isDark ? '#060608' : '#fafafa',
        fg: isDark ? '#f0f0f0' : '#0a0a0a',
        mid: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
        muted: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.15)',
        rule: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        blue: isDark ? '#60a5fa' : '#2563eb',
        blueGlow: isDark ? 'rgba(96,165,250,0.15)' : 'rgba(37,99,235,0.1)',
        blueFaint: isDark ? 'rgba(96,165,250,0.06)' : 'rgba(37,99,235,0.04)',
    }
}

export default function Footer({ theme }: FooterProps) {
    const isDark = theme === 'dark'
    const p = pal(isDark)
    const year = new Date().getFullYear()

    // ── Easter egg ────────────────────────────────────────────────
    const [clicks, setClicks] = useState(0)
    const [eggText, setEggText] = useState(`© ${year} Stryer`)
    const [eggActive, setEggActive] = useState(false)
    const timerRef = useRef<number | undefined>(undefined)

    const triggerEgg = useCallback(() => {
        const next = clicks + 1
        setClicks(next)
        if (next >= 7 && !eggActive) {
            setEggActive(true)
            let frame = 0
            window.clearInterval(timerRef.current)
            timerRef.current = window.setInterval(() => {
                setEggText(SECRET.split('').map((c, i) => {
                    if (c === ' ') return ' '
                    if (frame >= i * 1.2 + 4) return c
                    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
                }).join(''))
                frame++
                if (frame > SECRET.length * 1.2 + 6) {
                    setEggText(SECRET)
                    window.clearInterval(timerRef.current)
                    setTimeout(() => { setEggText(`© ${year} Stryer`); setEggActive(false); setClicks(0) }, 4000)
                }
            }, 30)
        }
    }, [clicks, eggActive, year])

    useEffect(() => () => window.clearInterval(timerRef.current), [])

    const scrollTo = useCallback((id: string) => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, [])

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    return (
        <>
            <footer
                style={{
                    position: 'relative', zIndex: 2,
                    background: p.bg,
                    fontFamily: '"DM Sans", sans-serif',
                    transition: 'background 0.4s ease',
                }}
            >
                {/* ── Top rule ── */}
                <div style={{
                    height: 1,
                    margin: '0 clamp(24px, 6vw, 80px)',
                    background: p.rule,
                    transition: 'background 0.4s ease',
                }} />

                {/* ── Main grid ── */}
                <div
                    className="footer-grid"
                    style={{
                        maxWidth: 1100,
                        margin: '0 auto',
                        padding: 'clamp(28px, 4vh, 48px) clamp(24px, 6vw, 80px)',
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                        gap: 'clamp(24px, 4vw, 60px)',
                        alignItems: 'start',
                    }}
                >
                    {/* ── Left: brand + copyright ── */}
                    <div>
                        <button
                            onClick={() => scrollToTop()}
                            style={{
                                fontSize: 14, fontWeight: 700,
                                letterSpacing: '0.12em', textTransform: 'uppercase',
                                color: p.blue,
                                fontFamily: '"DM Mono", monospace',
                                background: 'none', border: 'none', cursor: 'pointer',
                                padding: 0, marginBottom: 12,
                                display: 'block',
                                textShadow: `0 0 12px ${p.blueGlow}`,
                                transition: 'color 0.4s ease',
                            }}
                        >
                            Stryer
                        </button>

                        <motion.button
                            onClick={triggerEgg}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                fontSize: 11,
                                fontFamily: '"DM Mono", monospace',
                                color: eggActive ? p.blue : p.muted,
                                letterSpacing: '0.03em',
                                background: 'none', border: 'none',
                                cursor: 'default', padding: 0,
                                whiteSpace: 'nowrap', textAlign: 'left',
                                transition: 'color 0.3s ease',
                                display: 'block',
                            }}
                        >
                            {eggText}
                        </motion.button>

                        <AnimatePresence>
                            {clicks >= 4 && clicks < 7 && !eggActive && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.4 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        display: 'block', marginTop: 6,
                                        fontSize: 9, fontFamily: '"DM Mono", monospace',
                                        color: p.blue, letterSpacing: '0.06em',
                                    }}
                                >
                                    {7 - clicks} more...
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ── Center: navigation ── */}
                    <div>
                        <span style={{
                            fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                            color: p.muted, fontWeight: 500,
                            display: 'block', marginBottom: 14,
                            fontFamily: '"DM Mono", monospace',
                            transition: 'color 0.4s ease',
                        }}>
                            Navigate
                        </span>

                        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {NAV_LINKS.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollTo(link.id)}
                                    style={{
                                        fontSize: 13, fontWeight: 400,
                                        color: p.mid,
                                        background: 'none', border: 'none',
                                        cursor: 'pointer', padding: 0,
                                        textAlign: 'left',
                                        fontFamily: '"DM Sans", sans-serif',
                                        transition: 'color 0.25s ease',
                                        display: 'flex', alignItems: 'center', gap: 8,
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = p.blue)}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = p.mid)}
                                >
                                    <span style={{
                                        width: 0, height: 1, background: p.blue,
                                        transition: 'width 0.25s ease',
                                    }}
                                        className={`footer-link-line-${link.id}`}
                                    />
                                    {link.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* ── Right: socials + back to top ── */}
                    <div style={{ textAlign: 'right' }}>
                        <span style={{
                            fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                            color: p.muted, fontWeight: 500,
                            display: 'block', marginBottom: 14,
                            fontFamily: '"DM Mono", monospace',
                            transition: 'color 0.4s ease',
                        }}>
                            Connect
                        </span>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                            {SOCIALS.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        fontSize: 13, fontWeight: 400,
                                        color: p.mid, textDecoration: 'none',
                                        fontFamily: '"DM Sans", sans-serif',
                                        transition: 'color 0.25s ease',
                                        display: 'flex', alignItems: 'center', gap: 6,
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = p.blue)}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = p.mid)}
                                >
                                    {s.label}
                                    <span style={{
                                        fontSize: 10, opacity: 0.5,
                                        fontFamily: '"DM Mono", monospace',
                                    }}>↗</span>
                                </a>
                            ))}
                        </div>

                        {/* Back to top */}
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="footer-top"
                            style={{
                                marginTop: 20,
                                width: 32, height: 32, borderRadius: 16,
                                border: `1px solid ${p.rule}`,
                                background: 'transparent', cursor: 'pointer',
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                color: p.mid, fontSize: 14,
                                fontFamily: '"DM Mono", monospace',
                                transition: 'color 0.25s ease, border-color 0.25s ease, background 0.25s ease, transform 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = p.blue
                                e.currentTarget.style.borderColor = p.blue
                                e.currentTarget.style.background = p.blueFaint
                                e.currentTarget.style.transform = 'translateY(-3px)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = p.mid
                                e.currentTarget.style.borderColor = p.rule
                                e.currentTarget.style.background = 'transparent'
                                e.currentTarget.style.transform = 'translateY(0)'
                            }}
                        >↑</button>
                    </div>
                </div>
            </footer>

            {/* ═══ Responsive ═══ */}
            <style>{`
                @media (max-width: 600px) {
                    .footer-grid {
                        grid-template-columns: 1fr 1fr !important;
                        gap: 28px 20px !important;
                    }
                    .footer-grid > div:first-child {
                        grid-column: 1 / -1;
                        text-align: center;
                    }
                    .footer-grid > div:first-child button {
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .footer-grid > div:last-child {
                        text-align: right;
                    }
                    .footer-top {
                        display: none !important;
                    }
                }
            `}</style>
        </>
    )
}