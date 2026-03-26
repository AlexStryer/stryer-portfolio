import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { Theme } from '../hooks/useTheme'

interface HeroProps {
    theme: Theme
    onToggleTheme: () => void
    onRocketClick: () => void
}

const NAV_LINKS = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Stack', href: '#stack' },
    { label: 'Contact', href: '#contact' },
]

export default function Hero({ theme, onToggleTheme, onRocketClick }: HeroProps) {
    const isDark = theme === 'dark'
    const sectionRef = useRef<HTMLElement>(null)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    })
    const rocketOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
    const rocketY = useTransform(scrollYProgress, [0, 0.25], [0, -40])

    const bg = isDark ? '#000' : '#fff'
    const fg = isDark ? '#fff' : '#000'
    const muted = isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.28)'
    const dividerColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'

    const navBg = isDark ? 'rgba(10,10,10,0.65)' : 'rgba(255,255,255,0.7)'
    const navBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
    const navShadow = isDark
        ? '0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 32px rgba(0,0,0,0.5)'
        : '0 1px 0 rgba(255,255,255,0.9) inset, 0 8px 32px rgba(0,0,0,0.08)'

    const btnBorder = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)'
    const btnColor = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)'

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

                .rocket-wrap {
                    position: relative;
                    display: inline-flex;
                    flex-direction: column;
                    align-items: center;
                }
                .rocket-label {
                    margin-top: 10px;
                    font-size: 9px;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    opacity: 0;
                    transition: opacity 220ms ease;
                    pointer-events: none;
                    font-family: 'DM Sans', sans-serif;
                    white-space: nowrap;
                }
                .rocket-wrap:hover .rocket-label { opacity: 1; }

                .nav-link {
                    font-size: 10px;
                    font-weight: 500;
                    letter-spacing: 0.14em;
                    text-decoration: none;
                    padding: 5px 16px;
                    text-transform: uppercase;
                    transition: color 180ms ease;
                    font-family: 'DM Sans', sans-serif;
                }

                .toggle-btn {
                    background: transparent;
                    border-radius: 999px;
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.13em;
                    cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    text-transform: uppercase;
                    white-space: nowrap;
                    padding: 7px 20px;
                    transition: background 200ms ease, color 200ms ease, border-color 200ms ease;
                }
            `}</style>

            <section
                id="hero"
                ref={sectionRef}
                style={{
                    position: 'relative',
                    height: '100vh',
                    background: bg,
                    color: fg,
                    fontFamily: '"DM Sans", sans-serif',
                    transition: 'background 0.4s ease, color 0.4s ease',
                    overflow: 'hidden',
                }}
            >
                {/* ── Navbar — fixed, centered pill ── */}
                <motion.nav
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    style={{
                        position: 'fixed',
                        top: 20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 50,
                        display: 'flex',
                        alignItems: 'center',
                        background: navBg,
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: `1px solid ${navBorder}`,
                        borderRadius: 999,
                        boxShadow: navShadow,
                        padding: '8px 20px',
                    }}
                >
                    <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: fg,
                        transition: 'color 0.4s ease',
                        marginRight: 8,
                        flexShrink: 0,
                    }}>
                        Stryer
                    </span>
                    <div style={{ width: 1, height: 14, background: navBorder, marginRight: 4, flexShrink: 0 }} />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="nav-link"
                                style={{ color: muted }}
                                onMouseEnter={e => { e.currentTarget.style.color = fg }}
                                onMouseLeave={e => { e.currentTarget.style.color = muted }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </motion.nav>

                {/* ── Toggle — absolute inside hero, top-right ── */}
                <motion.button
                    className="toggle-btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    onClick={(e) => { e.stopPropagation(); onToggleTheme() }}
                    style={{
                        position: 'absolute',   // ← absolute, not fixed
                        top: 20,
                        right: 32,
                        zIndex: 50,
                        border: `1px solid ${btnBorder}`,
                        color: btnColor,
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = fg
                        e.currentTarget.style.color = bg
                        e.currentTarget.style.borderColor = fg
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = btnColor
                        e.currentTarget.style.borderColor = btnBorder
                    }}
                >
                    {isDark ? '○ Light' : '● Dark'}
                </motion.button>

                {/* ── Rocket ── */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%', height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: rocketOpacity,
                        y: rocketY,
                        zIndex: 5,
                        pointerEvents: 'none',
                    }}
                >
                    <div className="rocket-wrap" style={{ pointerEvents: 'auto', color: muted }}>
                        <motion.img
                            src={isDark
                                ? `${import.meta.env.BASE_URL}NaveBlanca.png`
                                : `${import.meta.env.BASE_URL}NaveNegra.png`}
                            alt="Rocket"
                            onClick={(e) => { e.stopPropagation(); onRocketClick() }}
                            style={{
                                width: 130, height: 130,
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
                        <span className="rocket-label">↺ replay intro</span>
                    </div>
                </motion.div>

                {/* ── Bottom block ── */}
                <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    zIndex: 6,
                    padding: '0 44px 32px',
                }}>
                    {/*
                     * Layout (bottom-up):
                     *   • The divider sits at a fixed distance from the bottom
                     *   • The h1 is position:absolute with its BOTTOM anchored
                     *     exactly at the divider's top edge (bottom: 1px)
                     *   • That means the text baseline lands naturally just above
                     *     the line, and the "y" descender crosses it organically
                     */}

                    {/* Outer wrapper — sized by the footer text below */}
                    <div style={{ position: 'relative' }}>

                        {/* The title — absolutely anchored to just above the divider */}
                        <motion.h1
                            initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
                            animate={{ clipPath: 'inset(0 0 -30% 0)', opacity: 1 }}
                            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            style={{
                                position: 'absolute',
                                bottom: 1,      // sits flush on top of the 1px divider
                                left: 0,
                                zIndex: 2,
                                fontSize: 'clamp(96px, 17.5vw, 256px)',
                                fontWeight: 400,
                                letterSpacing: '-0.01em',
                                lineHeight: 1,
                                margin: 0,
                                fontFamily: '"Playfair Display", Georgia, serif',
                                color: fg,
                                userSelect: 'none',
                                transition: 'color 0.4s ease',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Stryer
                        </motion.h1>

                        {/* Divider — z-index 1, title paints over it */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.1, ease: 'easeOut', delay: 0.45 }}
                            style={{
                                // This div's height determines how far the title sits above the footer
                                // It needs to be tall enough to not overlap the h1
                                // We use paddingTop as a spacer for the absolute-positioned h1
                                paddingTop: 'clamp(96px, 17.5vw, 256px)',
                                position: 'relative',
                                zIndex: 1,
                            }}
                        >
                            <div style={{
                                height: 1,
                                background: dividerColor,
                                transformOrigin: 'left',
                            }} />
                        </motion.div>
                    </div>

                    {/* Name + role — below the divider */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.75 }}
                        style={{
                            marginTop: 12,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <span style={{
                            fontSize: 11,
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            color: muted,
                        }}>
                            Alexandro Stryer Díaz
                        </span>
                        <span style={{
                            fontSize: 10,
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: muted,
                        }}>
                            Software Engineer · Frontend & Full-Stack
                        </span>
                    </motion.div>
                </div>
            </section>
        </>
    )
}