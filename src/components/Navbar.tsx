import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Theme } from '../hooks/useTheme'

interface NavbarProps {
    theme: Theme
    onToggleTheme: () => void
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const NAV_LINKS = [
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
]
const GLYPHS = '░▒▓█╬═╦╠╩01!@#$%&?'

function pal(isDark: boolean) {
    return {
        fg: isDark ? '#f0f0f0' : '#0a0a0a',
        mid: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)',
        muted: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.18)',
        rule: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        blue: isDark ? '#60a5fa' : '#2563eb',
        blueGlow: isDark ? 'rgba(96,165,250,0.2)' : 'rgba(37,99,235,0.15)',
        blueFaint: isDark ? 'rgba(96,165,250,0.08)' : 'rgba(37,99,235,0.06)',

        pill: isDark ? 'rgba(12, 12, 12, 0.82)' : 'rgba(255, 255, 255, 0.82)',
        pillBd: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.07)',
        overlay: isDark ? 'rgba(0, 0, 0, 0.94)' : 'rgba(255, 255, 255, 0.96)',

        toggleBg: isDark ? 'rgba(96,165,250,0.1)' : 'rgba(37,99,235,0.06)',
        toggleBd: isDark ? 'rgba(96,165,250,0.2)' : 'rgba(37,99,235,0.15)',
    }
}

function useScrambleHover(text: string) {
    const [display, setDisplay] = useState(text)
    const ref = useRef<number | undefined>(undefined)
    const onEnter = useCallback(() => {
        let frame = 0
        window.clearInterval(ref.current)
        ref.current = window.setInterval(() => {
            setDisplay(text.split('').map((c, i) => {
                if (c === ' ') return ' '
                if (frame >= i * 1.5 + 4) return c
                return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            }).join(''))
            frame++
            if (frame > text.length * 1.5 + 6) { setDisplay(text); window.clearInterval(ref.current) }
        }, 35)
    }, [text])
    const onLeave = useCallback(() => { window.clearInterval(ref.current); setDisplay(text) }, [text])
    useEffect(() => () => window.clearInterval(ref.current), [])
    return { display, onEnter, onLeave }
}

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
    const isDark = theme === 'dark'
    const p = pal(isDark)
    const [activeSection, setActiveSection] = useState('')
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [showHint, setShowHint] = useState(true)
    const brand = useScrambleHover('Stryer')

    useEffect(() => {
        const t = setTimeout(() => setShowHint(false), 4000)
        return () => clearTimeout(t)
    }, [])

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 60)
            let current = ''
            for (const link of NAV_LINKS) {
                const el = document.getElementById(link.id)
                if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = link.id
            }
            setActiveSection(current)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    useEffect(() => {
        const fn = () => { if (window.innerWidth > 640) setMobileOpen(false) }
        window.addEventListener('resize', fn)
        return () => window.removeEventListener('resize', fn)
    }, [])

    const scrollTo = useCallback((id: string) => {
        setMobileOpen(false)
        if (id === 'hero') {
            document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [])

    return (
        <>
            <style>{`
                @keyframes pulse-hint {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(96,165,250,0); }
                    50% { box-shadow: 0 0 0 6px rgba(96,165,250,0.15); }
                }
                @media (min-width: 641px) {
                    .nav-desk { display: flex !important; }
                    .nav-burger { display: none !important; }
                }
                @media (max-width: 640px) {
                    .nav-desk { display: none !important; }
                    .nav-burger { display: flex !important; }
                }
            `}</style>

            {/* ═══ PILL NAV ═══ */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                style={{
                    position: 'fixed', top: 20, left: '50%',
                    transform: 'translateX(-50%)', zIndex: 100,
                    display: 'flex', alignItems: 'center',
                    height: 44, borderRadius: 22, padding: '0 4px',
                    background: p.pill,
                    border: `1px solid ${p.pillBd}`,
                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: scrolled
                        ? `0 4px 24px rgba(0,0,0,${isDark ? 0.3 : 0.06})`
                        : `0 2px 8px rgba(0,0,0,${isDark ? 0.15 : 0.03})`,
                    fontFamily: '"DM Sans", sans-serif',
                    transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
                }}
            >
                {/* ── Brand ── */}
                <button
                    onClick={() => scrollTo('hero')}
                    onMouseEnter={brand.onEnter}
                    onMouseLeave={brand.onLeave}
                    style={{
                        fontSize: 12, fontWeight: 700,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: p.blue,
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: '0 16px', height: '100%',
                        display: 'flex', alignItems: 'center',
                        fontFamily: '"DM Mono", monospace',
                        transition: 'color 0.4s ease',
                        minWidth: 68,
                        textShadow: `0 0 12px ${p.blueGlow}`,
                    }}
                >
                    {brand.display}
                </button>

                <div style={{ width: 1, height: 16, background: p.pillBd, flexShrink: 0, transition: 'background 0.4s ease' }} />

                {/* ── Desktop links ── */}
                <div className="nav-desk" style={{ display: 'flex', alignItems: 'center' }}>
                    {NAV_LINKS.map((link) => {
                        const active = activeSection === link.id
                        return (
                            <button
                                key={link.id}
                                onClick={() => scrollTo(link.id)}
                                style={{
                                    position: 'relative',
                                    fontSize: 11, fontWeight: active ? 500 : 400,
                                    letterSpacing: '0.08em', textTransform: 'uppercase',
                                    color: active ? p.fg : p.mid,
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    padding: '0 16px', height: 44,
                                    display: 'flex', alignItems: 'center',
                                    fontFamily: '"DM Sans", sans-serif',
                                    transition: 'color 0.25s ease',
                                }}
                                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = p.fg }}
                                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = p.mid }}
                            >
                                {link.label}
                                {active && (
                                    <motion.span
                                        layoutId="nav-dot"
                                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                                        style={{
                                            position: 'absolute', bottom: 7, left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: 4, height: 4, borderRadius: '50%',
                                            background: p.blue,
                                            boxShadow: `0 0 6px ${p.blueGlow}`,
                                        }}
                                    />
                                )}
                            </button>
                        )
                    })}

                    <div style={{ width: 1, height: 16, background: p.pillBd, flexShrink: 0, margin: '0 2px', transition: 'background 0.4s ease' }} />

                    {/* ── Theme toggle (prominent) ── */}
                    <button
                        onClick={() => { onToggleTheme(); setShowHint(false) }}
                        style={{
                            fontSize: 10, fontWeight: 500,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            color: p.blue,
                            background: p.toggleBg,
                            border: `1px solid ${p.toggleBd}`,
                            borderRadius: 14,
                            cursor: 'pointer',
                            padding: '5px 12px', margin: '0 4px',
                            height: 28,
                            display: 'flex', alignItems: 'center', gap: 6,
                            fontFamily: '"DM Sans", sans-serif',
                            transition: 'all 0.3s ease',
                            animation: showHint ? 'pulse-hint 2s ease infinite' : 'none',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = isDark ? 'rgba(96,165,250,0.15)' : 'rgba(37,99,235,0.1)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = p.toggleBg
                        }}
                    >
                        <motion.span
                            animate={{ background: isDark ? p.blue : 'transparent' }}
                            transition={{ duration: 0.35 }}
                            style={{
                                width: 7, height: 7, borderRadius: '50%',
                                border: `1.5px solid ${p.blue}`,
                            }}
                        />
                        {isDark ? 'Dark' : 'Light'}
                    </button>
                </div>

                {/* ── Mobile burger ── */}
                <button
                    className="nav-burger"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                    style={{
                        display: 'none', background: 'none', border: 'none',
                        cursor: 'pointer', padding: '0 14px', height: 44,
                        alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column', gap: 4,
                    }}
                >
                    <span style={{ width: 16, height: 1.5, borderRadius: 1, background: p.blue, transition: 'background 0.4s ease' }} />
                    <span style={{ width: 12, height: 1.5, borderRadius: 1, background: p.mid, transition: 'background 0.4s ease' }} />
                </button>
            </motion.nav>

            {/* ═══ MOBILE OVERLAY ═══ */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 200,
                            background: p.overlay,
                            backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            fontFamily: '"DM Sans", sans-serif',
                        }}
                    >
                        <motion.button
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            onClick={() => setMobileOpen(false)}
                            aria-label="Close menu"
                            style={{
                                position: 'absolute', top: 22, right: 22,
                                width: 40, height: 40, background: 'none',
                                border: `1px solid ${p.rule}`, borderRadius: 20,
                                cursor: 'pointer', color: p.fg, fontSize: 18,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'color 0.4s ease, border-color 0.4s ease',
                            }}
                        >✕</motion.button>

                        <motion.button
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08, duration: 0.35, ease: EASE }}
                            onClick={() => scrollTo('hero')}
                            style={{
                                fontSize: 13, fontWeight: 700,
                                letterSpacing: '0.14em', textTransform: 'uppercase',
                                color: p.blue, background: 'none', border: 'none',
                                cursor: 'pointer', padding: '12px 0', marginBottom: 20,
                                fontFamily: '"DM Mono", monospace',
                                textShadow: `0 0 16px ${p.blueGlow}`,
                            }}
                        >Stryer</motion.button>

                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.15, duration: 0.3 }}
                            style={{ width: 28, height: 2, background: p.blue, opacity: 0.3, marginBottom: 28, borderRadius: 1 }}
                        />

                        {NAV_LINKS.map((link, i) => {
                            const active = activeSection === link.id
                            return (
                                <motion.button
                                    key={link.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.12 + i * 0.07, duration: 0.35, ease: EASE }}
                                    onClick={() => scrollTo(link.id)}
                                    style={{
                                        fontSize: 32, fontWeight: 400,
                                        color: active ? p.fg : p.mid,
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        padding: '14px 0',
                                        fontFamily: '"Playfair Display", Georgia, serif',
                                        fontStyle: 'italic',
                                        transition: 'color 0.3s ease',
                                        display: 'flex', alignItems: 'center', gap: 12,
                                    }}
                                >
                                    {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.blue, boxShadow: `0 0 8px ${p.blueGlow}`, flexShrink: 0 }} />}
                                    {link.label}
                                </motion.button>
                            )
                        })}

                        <motion.button
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.35, ease: EASE }}
                            onClick={onToggleTheme}
                            style={{
                                marginTop: 36, fontSize: 10, fontWeight: 500,
                                letterSpacing: '0.12em', textTransform: 'uppercase',
                                color: p.blue, background: p.toggleBg,
                                border: `1px solid ${p.toggleBd}`, borderRadius: 20,
                                padding: '10px 22px', cursor: 'pointer',
                                fontFamily: '"DM Sans", sans-serif',
                                display: 'flex', alignItems: 'center', gap: 8,
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <motion.span
                                animate={{ background: isDark ? p.blue : 'transparent' }}
                                transition={{ duration: 0.35 }}
                                style={{ width: 7, height: 7, borderRadius: '50%', border: `1.5px solid ${p.blue}` }}
                            />
                            {isDark ? 'Dark' : 'Light'}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}