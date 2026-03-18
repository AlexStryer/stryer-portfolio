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

interface NavLinkProps {
    label: string
    href: string
    mutedColor: string
    textColor: string
}

function NavLink({ label, href, mutedColor, textColor }: NavLinkProps) {
    return (
    <a
        href = { href }
      onMouseEnter = {(e) => { e.currentTarget.style.color = textColor }
}
onMouseLeave = {(e) => { e.currentTarget.style.color = mutedColor }}
style = {{
    color: mutedColor,
        fontSize: 11,
            fontWeight: 500,
                letterSpacing: '0.14em',
                    textDecoration: 'none',
                        padding: '4px 16px',
                            borderRadius: 999,
                                transition: 'color 200ms ease',
                                    textTransform: 'uppercase' as const,
                                        fontFamily: '"DM Sans", sans-serif',
      }}
    >
    { label }
    </a >
  )
}

interface GlossyButtonProps {
    onClick: () => void
    children: React.ReactNode
    isDark: boolean
}

function GlossyButton({ onClick, children, isDark }: GlossyButtonProps) {
    return (
        <button
            onClick={(e) => { e.stopPropagation(); onClick() }}
            style={{
                background: isDark
                    ? 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.10) 100%)'
                    : 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.85) 100%)',
                border: isDark ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(0,0,0,0.15)',
                boxShadow: isDark
                    ? 'inset 0 1.5px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.2), 0 4px 20px rgba(0,0,0,0.4)'
                    : 'inset 0 1.5px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,100,200,0.1), 0 4px 20px rgba(14,165,233,0.2)',
                color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,80,160,0.9)',
                padding: '7px 20px',
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.14em',
                cursor: 'pointer',
                fontFamily: '"DM Sans", sans-serif',
                textTransform: 'uppercase' as const,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                transition: 'all 180ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(0.98)' }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)' }}
        >
            {children}
        </button>
    )
}

export default function Hero({ theme, onToggleTheme, onRocketClick }: HeroProps) {
    const isDark = theme === 'dark'
    const sectionRef = useRef<HTMLElement>(null)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    })
    const rocketOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
    const rocketY = useTransform(scrollYProgress, [0, 0.25], [0, -40])

    const textColor = isDark ? '#ffffff' : '#000000'
    const accentColor = isDark ? 'rgba(220,38,38,1)' : 'rgba(14,165,233,1)'
    const accentMuted = isDark ? 'rgba(220,38,38,0.7)' : 'rgba(14,165,233,0.7)'
    const mutedColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.28)'

    const glassBg = isDark
        ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)'
        : 'linear-gradient(135deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.03) 100%)'
    const glassBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
    const glassBoxShadow = isDark
        ? 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.3)'
        : '0 8px 32px rgba(0,0,0,0.08)'
    const stryerGradient = isDark
        ? 'linear-gradient(135deg, #ffffff 0%, #ff6b6b 55%, #dc2626 100%)'
        : 'linear-gradient(135deg, #000000 0%, #1e3a5c 50%, #0ea5e9 100%)'

    return (
        <section
            id="hero"
            ref={sectionRef}
            style={{
                position: 'relative' as const,
                height: '100vh',
                color: textColor,
                fontFamily: '"DM Sans", sans-serif',
            }}
        >
            {/* Navbar */}
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                style={{
                    position: 'fixed' as const,
                    top: 24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    background: glassBg,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `1px solid ${glassBorder}`,
                    borderRadius: 999,
                    padding: '8px 16px',
                    boxShadow: glassBoxShadow,
                }}
            >
                {NAV_LINKS.map((link) => (
                    <NavLink
                        key={link.label}
                        label={link.label}
                        href={link.href}
                        mutedColor={mutedColor}
                        textColor={textColor}
                    />
                ))}
            </motion.nav>

            {/* Rocket — centered, fades on scroll */}
            <motion.div
                style={{
                    position: 'absolute' as const,
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: rocketOpacity,
                    y: rocketY,
                    zIndex: 5,
                    pointerEvents: 'none' as const,
                }}
            >
                <motion.img
                    src={isDark ? `${import.meta.env.BASE_URL}NaveBlanca.png` : `${import.meta.env.BASE_URL}NaveNegra.png`}
                    alt="Rocket"
                    onClick={(e) => { e.stopPropagation(); onRocketClick() }}
                    style={{
                        width: 160,
                        height: 160,
                        objectFit: 'contain',
                        userSelect: 'none',
                        cursor: 'pointer',
                        pointerEvents: 'auto' as const,
                    }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    draggable={false}
                    title="Click to replay"
                />
            </motion.div>

            {/* Quote — top left */}
            <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
                style={{
                    position: 'absolute' as const,
                    top: 100,
                    left: 48,
                    maxWidth: 280,
                    zIndex: 6,
                }}
            >
                <p style={{
                    fontSize: 11,
                    lineHeight: 1.8,
                    letterSpacing: '0.06em',
                    color: mutedColor,
                    margin: 0,
                    fontStyle: 'italic',
                    borderLeft: `2px solid ${accentColor}`,
                    paddingLeft: 14,
                }}>
                    "Hard work beats talent,<br />
                    when talent fails to work hard"
                </p>
            </motion.div>

            {/* Theme concept note — top right */}
            <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
                style={{
                    position: 'absolute' as const,
                    top: 100,
                    right: 48,
                    maxWidth: 220,
                    textAlign: 'right' as const,
                    zIndex: 6,
                }}
            >
                <p style={{
                    fontSize: 10,
                    lineHeight: 1.9,
                    letterSpacing: '0.08em',
                    color: mutedColor,
                    margin: 0,
                }}>
                    This portfolio lives in two modes —<br />
                    <span style={{ color: accentColor, fontWeight: 600 }}>
                        {isDark ? 'dark · red' : 'light · blue'}
                    </span>
                    {' '}& the other.<br />
                    Click the rocket to replay<br />
                    or the button to 
                    <span style={{ color: accentColor, fontWeight: 600 }}>
                        {isDark ? ' switch' : ' switch'}
                    </span> modes.
                </p>
            </motion.div>

            {/* Bottom-left content */}
            <div
                style={{
                    position: 'absolute' as const,
                    bottom: 52,
                    left: 48,
                    right: 48,
                    zIndex: 6,
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.35 }}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        marginBottom: 16,
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 5 }}>
                        <span style={{
                            fontSize: 10,
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase' as const,
                            color: accentColor,
                            fontWeight: 600,
                        }}>
                            Software Engineer
                        </span>
                        <span style={{
                            fontSize: 10,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase' as const,
                            color: mutedColor,
                        }}>
                            Frontend & Full-Stack · React · TypeScript · Swift
                        </span>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column' as const,
                        alignItems: 'flex-end',
                        gap: 8,
                    }}>
                        <GlossyButton onClick={onToggleTheme} isDark={isDark}>
                            {isDark ? '☀ Light mode' : '◑ Dark mode'}
                        </GlossyButton>
                        <motion.span
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                fontSize: 10,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase' as const,
                                color: mutedColor,
                            }}
                        >
                            Scroll ↓
                        </motion.span>
                    </div>
                </motion.div>

                {/* STRYER */}
                <div style={{ overflow: 'hidden' }}>
                    <motion.h1
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                        style={{
                            fontSize: 'clamp(100px, 18vw, 260px)',
                            fontWeight: 400,
                            letterSpacing: '-0.02em',
                            lineHeight: 0.85,
                            margin: 0,
                            fontFamily: '"Bebas Neue", sans-serif',
                            background: stryerGradient,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            userSelect: 'none' as const,
                        }}
                    >
                        STRYER
                    </motion.h1>
                </div>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.0, ease: 'easeOut', delay: 0.5 }}
                    style={{
                        height: 1,
                        background: isDark
                            ? 'linear-gradient(90deg, rgba(220,38,38,0.5), transparent)'
                            : 'linear-gradient(90deg, rgba(14,165,233,0.4), transparent)',
                        transformOrigin: 'left' as const,
                        marginTop: 12,
                    }}
                />

                {/* Full name + year */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.7 }}
                    style={{
                        marginTop: 10,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <span style={{
                        fontSize: 11,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase' as const,
                        color: accentMuted,
                    }}>
                        Alexandro Stryer Díaz
                    </span>
                    <span style={{
                        fontSize: 11,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase' as const,
                        color: mutedColor,
                    }}>
                        MX — 2025
                    </span>
                </motion.div>
            </div>
        </section>
    )
}