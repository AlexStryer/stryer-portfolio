import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import type { Theme } from '../hooks/useTheme'
import { pal } from '../utils/palette'
import profileImg from '/profile.png'

// ── Constants ─────────────────────────────────────────────────────────────────

interface ContactProps {
    theme: Theme
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const GLYPHS = '01!@#$%&?░▒▓█▀▄─│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬'

const EMAIL = 'alex.stryer@gmail.com'
const SOCIALS = [
    { label: 'GitHub', href: 'https://github.com/AlexStryer' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alexandro-stryer-diaz/' },
]

// ── Hooks ─────────────────────────────────────────────────────────────────────

/**
 * Scrambles text character-by-character when the element scrolls into view.
 * Each character cycles through random glyphs before resolving to the real char.
 * Plays only once.
 */
function useScrambleOnView(text: string, inView: boolean, delay = 0) {
    const [display, setDisplay] = useState('')
    const hasPlayed = useRef(false)

    useEffect(() => {
        if (!inView || hasPlayed.current) return
        hasPlayed.current = true

        const chars = text.split('')
        let frame = 0

        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                setDisplay(
                    chars.map((char, i) => {
                        if (char === ' ') return ' '
                        const revealAt = i * 1.8
                        if (frame >= revealAt + 6) return char
                        if (frame >= revealAt) return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
                        return ''
                    }).join('')
                )
                frame++
                if (frame > chars.length * 1.8 + 8) {
                    setDisplay(text)
                    clearInterval(interval)
                }
            }, 32)

            return () => clearInterval(interval)
        }, delay)

        return () => clearTimeout(timeout)
    }, [inView, text, delay])

    return display || (hasPlayed.current ? text : '')
}

/**
 * Scrambles text on mouse hover — cycles through glyphs then resolves.
 * Resets immediately on mouse leave.
 */
function useScrambleOnHover(text: string) {
    const [display, setDisplay] = useState(text)
    const [hovering, setHovering] = useState(false)
    const intervalRef = useRef<number | undefined>(undefined)

    const onEnter = useCallback(() => {
        setHovering(true)
        let frame = 0
        window.clearInterval(intervalRef.current)
        intervalRef.current = window.setInterval(() => {
            setDisplay(
                text.split('').map((char, i) => {
                    if (char === ' ') return ' '
                    const revealAt = i * 1.2
                    if (frame >= revealAt + 4) return char
                    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
                }).join('')
            )
            frame++
            if (frame > text.length * 1.2 + 6) {
                setDisplay(text)
                window.clearInterval(intervalRef.current)
            }
        }, 28)
    }, [text])

    const onLeave = useCallback(() => {
        setHovering(false)
        window.clearInterval(intervalRef.current)
        setDisplay(text)
    }, [text])

    useEffect(() => () => window.clearInterval(intervalRef.current), [])

    return { display, hovering, onEnter, onLeave }
}

// ── Sub-components ────────────────────────────────────────────────────────────

/** Blinking terminal-style cursor after the scramble heading. */
function BlinkingCursor({ color }: { color: string }) {
    return (
        <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, repeatType: 'reverse' }}
            style={{
                display: 'inline-block',
                width: 2,
                height: '0.85em',
                background: color,
                marginLeft: 3,
                verticalAlign: 'middle',
                borderRadius: 1,
            }}
        />
    )
}

/** Individual social link row with scramble-on-hover effect. */
function SocialLink({ label, href, isDark }: { label: string; href: string; isDark: boolean }) {
    const p = pal(isDark)
    const { display, hovering, onEnter, onLeave } = useScrambleOnHover(label)

    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            whileHover={{ x: 6 }}
            transition={{ duration: 0.25, ease: EASE }}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '18px 0',
                textDecoration: 'none',
                borderBottom: `1px solid ${p.line}`,
                cursor: 'pointer',
                transition: 'border-color 0.4s ease',
            }}
        >
            {/* Arrow indicator */}
            <motion.span
                animate={{ x: hovering ? 4 : 0, opacity: hovering ? 1 : 0.3 }}
                transition={{ duration: 0.25, ease: EASE }}
                style={{
                    fontSize: 14,
                    color: hovering ? p.blue : p.mid,
                    fontFamily: '"DM Mono", monospace',
                    transition: 'color 0.3s ease',
                }}
            >→</motion.span>

            {/* Label with scramble */}
            <span style={{
                fontSize: 'clamp(18px, 2vw, 24px)',
                fontFamily: '"DM Mono", monospace',
                fontWeight: 400,
                color: hovering ? p.blue : p.fg,
                letterSpacing: '0.04em',
                transition: 'color 0.15s ease',
                minWidth: 120,
            }}>{display}</span>

            {/* URL hint on hover */}
            <motion.span
                animate={{ opacity: hovering ? 0.4 : 0 }}
                transition={{ duration: 0.2 }}
                className="contact-url-hint"
                style={{
                    fontSize: 11,
                    fontFamily: '"DM Mono", monospace',
                    color: p.mid,
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            >
                {href.replace('https://', '').replace('www.', '')}
            </motion.span>
        </motion.a>
    )
}

/** Toast notification after copying email to clipboard. */
function CopiedToast({ show, isDark }: { show: boolean; isDark: boolean }) {
    const p = pal(isDark)
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    style={{
                        position: 'absolute',
                        top: -36,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: 11,
                        fontFamily: '"DM Mono", monospace',
                        color: p.bg,
                        background: p.fg,
                        padding: '5px 14px',
                        borderRadius: 6,
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.04em',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    }}
                >Copied to clipboard</motion.div>
            )}
        </AnimatePresence>
    )
}

// ── Section label helper ──────────────────────────────────────────────────────

/** Reusable uppercase label + horizontal rule pattern. */
function SectionLabel({ text, color, lineColor }: { text: string; color: string; lineColor: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{
                fontSize: 10,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color,
                fontWeight: 500,
                fontFamily: '"DM Mono", monospace',
                transition: 'color 0.4s ease',
            }}>{text}</span>
            <div style={{
                flex: 1, height: 1,
                background: lineColor,
                transition: 'background 0.4s ease',
            }} />
        </div>
    )
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * Contact section — full-viewport with:
 * - Scramble-decoded heading ("Let's build something.")
 * - Profile photo with blue glow
 * - Click-to-copy email with scramble hover
 * - Social links (GitHub, LinkedIn)
 * - Responsive: stacks to single column on mobile
 */
export default function Contact({ theme }: ContactProps) {
    const isDark = theme === 'dark'
    const p = pal(isDark)

    const headingRef = useRef<HTMLDivElement>(null)
    const inView = useInView(headingRef, { once: true, margin: '-80px' })

    const line1 = useScrambleOnView("Let's build", inView, 200)
    const line2 = useScrambleOnView('something.', inView, 600)

    const [copied, setCopied] = useState(false)
    const emailScramble = useScrambleOnHover(EMAIL)

    /** Copy email to clipboard and show toast for 2s. */
    const copyEmail = useCallback(() => {
        navigator.clipboard.writeText(EMAIL).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }, [])

    return (
        <>
            {/* Responsive styles */}
            <style>{`
                @media (max-width: 680px) {
                    .contact-heading-row {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 20px !important;
                        margin-bottom: 28px !important;
                    }
                    .contact-photo-wrap {
                        align-self: flex-start;
                    }
                    .contact-columns {
                        grid-template-columns: 1fr !important;
                        gap: 28px !important;
                    }
                    .contact-url-hint {
                        display: none !important;
                    }
                }
            `}</style>

            <section
                id="contact"
                style={{
                    position: 'relative',
                    background: p.bg,
                    color: p.fg,
                    fontFamily: '"DM Sans", sans-serif',
                    transition: 'background 0.4s ease, color 0.4s ease',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Subtle grid background */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.5,
                    backgroundImage: `
                        linear-gradient(${p.grid} 1px, transparent 1px),
                        linear-gradient(90deg, ${p.grid} 1px, transparent 1px)
                    `,
                    backgroundSize: '28px 28px',
                    pointerEvents: 'none',
                }} />

                {/* Content wrapper */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 'clamp(48px, 8vh, 96px) clamp(24px, 6vw, 80px) clamp(48px, 8vh, 80px)',
                    maxWidth: 1100,
                    width: '100%',
                    margin: '0 auto',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    {/* ── Section label ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.8, ease: EASE }}
                    >
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            marginBottom: 'clamp(32px, 5vh, 56px)',
                        }}>
                            <span style={{
                                fontSize: 10,
                                letterSpacing: '0.24em',
                                textTransform: 'uppercase',
                                color: p.muted,
                                fontWeight: 500,
                                transition: 'color 0.4s ease',
                            }}>Contact</span>
                            <div style={{
                                flex: 1, height: 1,
                                background: p.rule,
                                transition: 'background 0.4s ease',
                            }} />
                        </div>
                    </motion.div>

                    {/* ── Heading + profile photo ── */}
                    <div
                        ref={headingRef}
                        className="contact-heading-row"
                        style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            gap: 'clamp(24px, 4vw, 64px)',
                            marginBottom: 'clamp(40px, 6vh, 72px)',
                            flexWrap: 'wrap',
                        }}
                    >
                        {/* Scramble heading */}
                        <div style={{ flex: 1, minWidth: 240 }}>
                            {/* Line 1: monospace "Let's build" in blue */}
                            <div style={{
                                fontSize: 'clamp(36px, 7vw, 88px)',
                                fontFamily: '"Playfair Display", Georgia, serif',
                                fontWeight: 400,
                                fontStyle: 'italic',
                                lineHeight: 1.08,
                                letterSpacing: '-0.02em',
                                color: p.fg,
                                transition: 'color 0.4s ease',
                            }}>
                                <span style={{
                                    fontFamily: '"DM Mono", monospace',
                                    fontStyle: 'normal',
                                    color: p.blue,
                                    transition: 'color 0.4s ease',
                                }}>{line1}</span>
                                {line1 && <BlinkingCursor color={p.blue} />}
                            </div>

                            {/* Line 2: italic "something." */}
                            <div style={{
                                fontSize: 'clamp(36px, 7vw, 88px)',
                                fontFamily: '"Playfair Display", Georgia, serif',
                                fontWeight: 400,
                                fontStyle: 'italic',
                                lineHeight: 1.08,
                                letterSpacing: '-0.02em',
                                color: p.fg,
                                transition: 'color 0.4s ease',
                                marginTop: 4,
                            }}>{line2}</div>
                        </div>

                        {/* Profile photo */}
                        <motion.div
                            className="contact-photo-wrap"
                            initial={{ opacity: 0, scale: 0.92 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                            style={{ position: 'relative', flexShrink: 0 }}
                        >
                            {/* Blue glow behind photo */}
                            <div style={{
                                position: 'absolute', inset: -6,
                                borderRadius: 16,
                                background: p.blue,
                                opacity: isDark ? 0.1 : 0.06,
                                filter: 'blur(16px)',
                                transition: 'opacity 0.4s ease',
                            }} />

                            <div style={{
                                position: 'relative',
                                width: 'clamp(110px, 14vw, 180px)',
                                height: 'clamp(110px, 14vw, 180px)',
                                borderRadius: 14,
                                overflow: 'hidden',
                                border: `1px solid ${p.line}`,
                                background: p.subtle,
                                transition: 'border-color 0.4s ease',
                            }}>
                                <img
                                    src={profileImg}
                                    alt="Alexandro Stryer Díaz"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block',
                                    }}
                                />
                            </div>

                            <div style={{
                                marginTop: 10,
                                textAlign: 'center',
                                fontSize: 10,
                                letterSpacing: '0.08em',
                                color: p.mid,
                                fontFamily: '"DM Mono", monospace',
                                transition: 'color 0.4s ease',
                            }}>Querétaro, MX</div>
                        </motion.div>
                    </div>

                    {/* ── Two-column: email + socials ── */}
                    <motion.div
                        className="contact-columns"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
                            gap: 'clamp(40px, 6vw, 80px)',
                            alignItems: 'start',
                        }}
                    >
                        {/* Email column */}
                        <div>
                            <SectionLabel text="Email" color={p.muted} lineColor={p.line} />

                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <CopiedToast show={copied} isDark={isDark} />
                                <motion.button
                                    onMouseEnter={emailScramble.onEnter}
                                    onMouseLeave={emailScramble.onLeave}
                                    onClick={copyEmail}
                                    whileHover={{ x: 4 }}
                                    transition={{ duration: 0.2, ease: EASE }}
                                    style={{
                                        fontSize: 'clamp(16px, 2.2vw, 28px)',
                                        fontFamily: '"DM Mono", monospace',
                                        fontWeight: 400,
                                        color: emailScramble.hovering ? p.blue : p.fg,
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '8px 0',
                                        letterSpacing: '0.02em',
                                        transition: 'color 0.15s ease',
                                        textAlign: 'left',
                                    }}
                                >{emailScramble.display}</motion.button>
                            </div>

                            <p style={{
                                fontSize: 13,
                                color: p.mid,
                                fontFamily: '"DM Mono", monospace',
                                marginTop: 10,
                                letterSpacing: '0.02em',
                                transition: 'color 0.4s ease',
                            }}>
                                Click to copy · or{' '}
                                <a
                                    href={`mailto:${EMAIL}`}
                                    style={{
                                        color: p.blueMid,
                                        textDecoration: 'none',
                                        borderBottom: `1px solid ${p.blueFaint}`,
                                        transition: 'color 0.3s ease',
                                    }}
                                >open in mail</a>
                            </p>
                        </div>

                        {/* Socials column */}
                        <div>
                            <SectionLabel text="Elsewhere" color={p.muted} lineColor={p.line} />

                            {SOCIALS.map((s) => (
                                <SocialLink
                                    key={s.label}
                                    label={s.label}
                                    href={s.href}
                                    isDark={isDark}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    )
}