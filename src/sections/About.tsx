import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import type { Theme } from '../hooks/useTheme'

interface AboutProps {
    theme: Theme
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

function pal(isDark: boolean) {
    return {
        bg: isDark ? '#000000' : '#ffffff',
        fg: isDark ? '#f0f0f0' : '#0a0a0a',
        mid: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
        muted: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.2)',
        rule: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',

        blue: isDark ? '#60a5fa' : '#2563eb',
        blueFaint: isDark ? 'rgba(96,165,250,0.06)' : 'rgba(37,99,235,0.05)',
        blueGlow: isDark ? 'rgba(96,165,250,0.12)' : 'rgba(37,99,235,0.08)',

        eng: {
            bg: isDark ? '#000000' : '#ffffff',
            h: isDark ? 'rgba(220,225,240,0.95)' : 'rgba(10,15,30,0.92)',
            p: isDark ? 'rgba(200,210,230,0.55)' : 'rgba(15,23,42,0.5)',
            dim: isDark ? 'rgba(200,210,230,0.24)' : 'rgba(15,23,42,0.22)',
            label: isDark ? 'rgba(96,165,250,0.7)' : 'rgba(37,99,235,0.7)',
            grid: isDark ? 'rgba(96,165,250,0.025)' : 'rgba(37,99,235,0.02)',
            tagC: isDark ? 'rgba(96,165,250,0.75)' : 'rgba(37,99,235,0.7)',
            tagBg: isDark ? 'rgba(96,165,250,0.07)' : 'rgba(37,99,235,0.06)',
            tagBd: isDark ? 'rgba(96,165,250,0.12)' : 'rgba(37,99,235,0.1)',
            line: isDark ? 'rgba(96,165,250,0.06)' : 'rgba(37,99,235,0.05)',
            dimTag: isDark ? 'rgba(200,210,230,0.3)' : 'rgba(15,23,42,0.25)',
            dimTagBd: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        },

        ent: {
            bg: isDark ? '#08080c' : '#f5f5f7',
            h: isDark ? 'rgba(215,215,230,0.95)' : 'rgba(15,15,25,0.92)',
            p: isDark ? 'rgba(210,210,225,0.52)' : 'rgba(20,20,30,0.48)',
            dim: isDark ? 'rgba(210,210,225,0.2)' : 'rgba(20,20,30,0.18)',
            label: isDark ? 'rgba(210,210,225,0.25)' : 'rgba(20,20,30,0.22)',
            bd: isDark ? 'rgba(210,210,225,0.06)' : 'rgba(20,20,30,0.06)',
        },
    }
}

// ── Data ──────────────────────────────────────────────────────────────────────

// Languages
const LANGUAGES = ['TypeScript', 'JavaScript', 'Python', 'Swift', 'SQL', 'C++', 'C#']

// Main stack (highlighted)
const STACK_MAIN = ['React', 'TypeScript', 'Tailwind CSS']

// Frameworks & tools
const FRAMEWORKS = ['Node.js', 'Django', 'Express', 'Git', 'Postman', 'Figma', 'Xcode', 'Unity']

// Cloud / DB / Auth
const INFRA = ['PostgreSQL', 'MariaDB', 'SQLite', 'AWS', 'REST APIs', 'Google Auth']

// What I've built
const BUILT = ['Landing Pages', 'Web Apps', 'CRM Systems', 'Mobile Apps', 'Blogs', 'Unity Games']

// Businesses
const VENTURES = [
    {
        name: 'OASIS',
        role: 'Founder',
        desc: 'Audio, lighting, and DJ rental company. Organizes private events and corporate productions.',
    },
    {
        name: 'Banu',
        role: 'Co-Founder',
        desc: 'Software development agency helping small businesses build an online presence.',
    },
    {
        name: 'QUIO',
        role: 'Founder',
        desc: 'Marketing agency for local companies. Ad campaigns, creative design, branding, and strategy.',
    },
]

// ── Split Panel ───────────────────────────────────────────────────────────────
function SplitPanel({ isDark }: { isDark: boolean }) {
    const p = pal(isDark)
    const containerRef = useRef<HTMLDivElement>(null)
    const [dragging, setDragging] = useState(false)
    const [hinted, setHinted] = useState(false)

    const rawPct = useMotionValue(68)
    const springPct = useSpring(rawPct, { stiffness: 300, damping: 30 })
    const displayPct = dragging ? rawPct : springPct

    const engX = useTransform(displayPct, [2, 50, 98], [8, 0, -4])
    const entX = useTransform(displayPct, [2, 50, 98], [4, 0, -8])
    const clipRight = useTransform(displayPct, (v: number) => `inset(0 ${100 - v}% 0 0)`)
    const dividerLeft = useTransform(displayPct, (v: number) => `${v}%`)

    const [currentPct, setCurrentPct] = useState(68)
    useEffect(() => {
        const unsub = displayPct.on('change', (v: number) => setCurrentPct(v))
        return unsub
    }, [displayPct])

    const calcPct = useCallback((clientX: number) => {
        const el = containerRef.current
        if (!el) return 50
        const rect = el.getBoundingClientRect()
        return Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100))
    }, [])

    useEffect(() => {
        if (!dragging) return
        const onMove = (e: MouseEvent) => rawPct.set(calcPct(e.clientX))
        const onTouch = (e: TouchEvent) => rawPct.set(calcPct(e.touches[0].clientX))
        const stop = () => setDragging(false)
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', stop)
        window.addEventListener('touchmove', onTouch, { passive: true })
        window.addEventListener('touchend', stop)
        return () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', stop)
            window.removeEventListener('touchmove', onTouch)
            window.removeEventListener('touchend', stop)
        }
    }, [dragging, calcPct, rawPct])

    useEffect(() => {
        const t1 = setTimeout(() => rawPct.set(28), 1000)
        const t2 = setTimeout(() => { rawPct.set(68); setHinted(true) }, 2400)
        return () => { clearTimeout(t1); clearTimeout(t2) }
    }, []) // eslint-disable-line

    const startDrag = (clientX: number) => {
        setDragging(true)
        setHinted(true)
        rawPct.set(calcPct(clientX))
    }

    const snapTo = (pct: number) => { setHinted(true); rawPct.set(pct) }
    const isEng = currentPct > 58
    const isEnt = currentPct < 42

    // ── Label + line helper ──
    const SectionLabel = ({ text, color, lineColor, font }: {
        text: string; color: string; lineColor: string; font: string
    }) => (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 18,
        }}>
            <span style={{
                fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
                color, fontWeight: 500, fontFamily: font,
                transition: 'color 0.4s ease',
            }}>{text}</span>
            <div style={{
                flex: 1, height: 1, background: lineColor,
                transition: 'background 0.4s ease',
            }} />
        </div>
    )

    return (
        <div
            ref={containerRef}
            onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX) }}
            onTouchStart={(e) => startDrag(e.touches[0].clientX)}
            style={{
                position: 'relative',
                height: 'clamp(520px, 54vw, 640px)',
                overflow: 'hidden',
                userSelect: 'none',
                cursor: dragging ? 'col-resize' : 'ew-resize',
                zIndex: 1,
            }}
        >
            {/* ═══ BASE: Entrepreneur ═══ */}
            <div style={{
                position: 'absolute', inset: 0,
                background: p.ent.bg,
                transition: 'background 0.4s ease',
            }}>
                <motion.div style={{
                    position: 'absolute', inset: 0,
                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                    x: entX,
                }}>
                    {/* Left: mindset */}
                    <div style={{
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '0 clamp(28px, 4vw, 56px)',
                        borderRight: `1px solid ${p.ent.bd}`,
                        transition: 'border-color 0.4s ease',
                    }}>
                        <div style={{
                            fontSize: 'clamp(28px, 3.5vw, 44px)',
                            fontFamily: '"Playfair Display", Georgia, serif',
                            fontWeight: 400, fontStyle: 'italic',
                            color: p.ent.h, lineHeight: 1.2,
                            marginBottom: 20, maxWidth: 300,
                            transition: 'color 0.4s ease',
                        }}>
                            The other half.
                        </div>

                        <p style={{
                            fontSize: 'clamp(14px, 1.15vw, 16px)',
                            lineHeight: 1.65, color: p.ent.p,
                            margin: '0 0 16px', fontWeight: 400, maxWidth: 340,
                            fontFamily: '"DM Sans", sans-serif',
                            transition: 'color 0.4s ease',
                        }}>
                            I don't just write code for other people's ideas.
                            I start things. I find problems, build teams, and
                            bring products to market.
                        </p>

                        <p style={{
                            fontSize: 'clamp(13px, 1vw, 15px)',
                            lineHeight: 1.6, color: p.ent.dim,
                            margin: 0, fontWeight: 400, maxWidth: 340,
                            fontFamily: '"DM Sans", sans-serif',
                            transition: 'color 0.4s ease',
                        }}>
                            Three companies across software, events, and
                            marketing. Each one taught me something code never could.
                        </p>
                    </div>

                    {/* Right: ventures */}
                    <div style={{
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '0 clamp(28px, 4vw, 56px)',
                    }}>
                        <SectionLabel
                            text="Ventures"
                            color={p.ent.label}
                            lineColor={p.ent.bd}
                            font='"Playfair Display", Georgia, serif'
                        />

                        {VENTURES.map((v, i) => (
                            <div key={v.name} style={{
                                padding: '16px 0',
                                borderTop: i > 0 ? `1px solid ${p.ent.bd}` : 'none',
                                transition: 'border-color 0.4s ease',
                            }}>
                                <div style={{ marginBottom: 4 }}>
                                    <span style={{
                                        fontSize: 'clamp(16px, 1.4vw, 19px)',
                                        fontFamily: '"Playfair Display", Georgia, serif',
                                        fontWeight: 400, color: p.ent.h,
                                        transition: 'color 0.4s ease',
                                    }}>{v.name}</span>
                                    <span style={{
                                        fontSize: 10, letterSpacing: '0.04em',
                                        color: p.ent.dim,
                                        fontFamily: '"DM Sans", sans-serif',
                                        fontWeight: 500, marginLeft: 10,
                                        transition: 'color 0.4s ease',
                                    }}>{v.role}</span>
                                </div>
                                <p style={{
                                    fontSize: 13.5, lineHeight: 1.55,
                                    color: p.ent.p, margin: 0, maxWidth: 340,
                                    fontFamily: '"DM Sans", sans-serif',
                                    transition: 'color 0.4s ease',
                                }}>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ═══ CLIP: Engineer ═══ */}
            <motion.div style={{
                position: 'absolute', inset: 0,
                clipPath: clipRight,
                background: p.eng.bg,
                willChange: 'clip-path',
                transition: 'background 0.4s ease',
            }}>
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.5,
                    backgroundImage: `
                        linear-gradient(${p.eng.grid} 1px, transparent 1px),
                        linear-gradient(90deg, ${p.eng.grid} 1px, transparent 1px)
                    `,
                    backgroundSize: '28px 28px', pointerEvents: 'none',
                }} />

                <motion.div style={{
                    position: 'absolute', inset: 0,
                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                    x: engX,
                }}>
                    {/* Left: bio + what I build */}
                    <div style={{
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '0 clamp(28px, 4vw, 56px)',
                        borderRight: `1px solid ${p.eng.line}`,
                        transition: 'border-color 0.4s ease',
                    }}>
                        <div style={{
                            fontSize: 'clamp(28px, 3.5vw, 44px)',
                            fontFamily: '"DM Mono", monospace',
                            fontWeight: 400, color: p.blue,
                            lineHeight: 1.2, marginBottom: 16,
                            transition: 'color 0.4s ease',
                        }}>
                            The code side.
                        </div>

                        <p style={{
                            fontSize: 'clamp(14px, 1.15vw, 16px)',
                            lineHeight: 1.65, color: p.eng.p,
                            margin: '0 0 22px', fontWeight: 400, maxWidth: 360,
                            fontFamily: '"DM Sans", sans-serif',
                            transition: 'color 0.4s ease',
                        }}>
                            Full-stack engineer focused on building real products.
                            I ship fast, clean interfaces that people actually use,
                            from client sites to internal tools.
                        </p>

                        <SectionLabel
                            text="What I've built"
                            color={p.eng.label}
                            lineColor={p.eng.line}
                            font='"DM Mono", monospace'
                        />

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {BUILT.map((item) => (
                                <span key={item} style={{
                                    fontSize: 12, color: p.eng.h,
                                    padding: '5px 12px', borderRadius: 4,
                                    border: `1px solid ${p.eng.line}`,
                                    fontFamily: '"DM Sans", sans-serif',
                                    fontWeight: 400, whiteSpace: 'nowrap',
                                    transition: 'all 0.4s ease',
                                }}>{item}</span>
                            ))}
                        </div>
                    </div>

                    {/* Right: stack */}
                    <div style={{
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '0 clamp(28px, 4vw, 56px)',
                    }}>
                        {/* Main stack */}
                        <SectionLabel
                            text="Main Stack"
                            color={p.eng.label}
                            lineColor={p.eng.line}
                            font='"DM Mono", monospace'
                        />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
                            {STACK_MAIN.map((tag) => (
                                <span key={tag} style={{
                                    fontSize: 12, letterSpacing: '0.02em',
                                    color: p.eng.tagC,
                                    padding: '5px 12px', borderRadius: 4,
                                    border: `1px solid ${p.eng.tagBd}`,
                                    background: p.eng.tagBg,
                                    fontFamily: '"DM Mono", monospace',
                                    fontWeight: 400, whiteSpace: 'nowrap',
                                    transition: 'all 0.4s ease',
                                }}>{tag}</span>
                            ))}
                        </div>

                        {/* Languages */}
                        <SectionLabel
                            text="Languages"
                            color={p.eng.dim}
                            lineColor={p.eng.line}
                            font='"DM Mono", monospace'
                        />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 22 }}>
                            {LANGUAGES.map((tag) => (
                                <span key={tag} style={{
                                    fontSize: 11, letterSpacing: '0.02em',
                                    color: p.eng.dimTag,
                                    padding: '4px 10px', borderRadius: 3,
                                    border: `1px solid ${p.eng.dimTagBd}`,
                                    fontFamily: '"DM Mono", monospace',
                                    fontWeight: 400, whiteSpace: 'nowrap',
                                    transition: 'all 0.4s ease',
                                }}>{tag}</span>
                            ))}
                        </div>

                        {/* Frameworks & tools */}
                        <SectionLabel
                            text="Frameworks & Tools"
                            color={p.eng.dim}
                            lineColor={p.eng.line}
                            font='"DM Mono", monospace'
                        />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 22 }}>
                            {FRAMEWORKS.map((tag) => (
                                <span key={tag} style={{
                                    fontSize: 11, letterSpacing: '0.02em',
                                    color: p.eng.dimTag,
                                    padding: '4px 10px', borderRadius: 3,
                                    border: `1px solid ${p.eng.dimTagBd}`,
                                    fontFamily: '"DM Mono", monospace',
                                    fontWeight: 400, whiteSpace: 'nowrap',
                                    transition: 'all 0.4s ease',
                                }}>{tag}</span>
                            ))}
                        </div>

                        {/* Cloud / DB */}
                        <SectionLabel
                            text="Cloud & Data"
                            color={p.eng.dim}
                            lineColor={p.eng.line}
                            font='"DM Mono", monospace'
                        />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                            {INFRA.map((tag) => (
                                <span key={tag} style={{
                                    fontSize: 11, letterSpacing: '0.02em',
                                    color: p.eng.dimTag,
                                    padding: '4px 10px', borderRadius: 3,
                                    border: `1px solid ${p.eng.dimTagBd}`,
                                    fontFamily: '"DM Mono", monospace',
                                    fontWeight: 400, whiteSpace: 'nowrap',
                                    transition: 'all 0.4s ease',
                                }}>{tag}</span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Divider */}
            <motion.div style={{
                position: 'absolute', top: 0, bottom: 0,
                left: dividerLeft, width: 2,
                transform: 'translateX(-50%)',
                background: `linear-gradient(to bottom,
                    transparent 2%, ${p.blueGlow} 8%, ${p.blue} 50%, ${p.blueGlow} 92%, transparent 98%)`,
                pointerEvents: 'none', zIndex: 3,
                boxShadow: `0 0 6px ${p.blueGlow}, 0 0 18px ${p.blueFaint}`,
            }} />

            {/* Handle */}
            <motion.div style={{
                position: 'absolute', top: '50%',
                left: dividerLeft,
                transform: 'translate(-50%, -50%)',
                zIndex: 4, pointerEvents: 'none',
            }}>
                <div style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute', inset: -8,
                        borderRadius: 16, background: p.blue,
                        filter: 'blur(10px)',
                        opacity: dragging ? 0.4 : 0.12,
                        transition: 'opacity 150ms ease',
                    }} />
                    <div style={{
                        position: 'relative',
                        width: 24, height: 44, borderRadius: 12,
                        background: '#fff',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 3,
                        boxShadow: '0 1px 8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
                        transition: 'transform 80ms ease',
                        transform: dragging ? 'scaleY(1.08)' : 'scaleY(1)',
                    }}>
                        <div style={{ width: 2, height: 2, borderRadius: '50%', background: '#bbb' }} />
                        <div style={{ width: 2, height: 2, borderRadius: '50%', background: '#bbb' }} />
                        <div style={{ width: 2, height: 2, borderRadius: '50%', background: '#bbb' }} />
                    </div>
                </div>
            </motion.div>

            {/* Snap tabs */}
            <button
                onClick={(e) => { e.stopPropagation(); snapTo(72) }}
                style={{
                    position: 'absolute', bottom: 14, left: 20,
                    fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: isEng ? p.eng.dim : p.eng.p,
                    fontFamily: '"DM Mono", monospace', fontWeight: 500,
                    cursor: 'pointer', zIndex: 3,
                    padding: '4px 10px', borderRadius: 4,
                    background: 'transparent',
                    border: isEng ? '1px solid transparent' : `1px solid ${p.eng.tagBd}`,
                    transition: 'all 300ms ease',
                }}
            >Engineer</button>

            <button
                onClick={(e) => { e.stopPropagation(); snapTo(28) }}
                style={{
                    position: 'absolute', bottom: 14, right: 20,
                    fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: isEnt ? p.ent.dim : p.ent.p,
                    fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontWeight: 400,
                    cursor: 'pointer', zIndex: 3,
                    padding: '4px 10px', borderRadius: 4,
                    background: 'transparent',
                    border: isEnt ? '1px solid transparent' : `1px solid ${p.ent.bd}`,
                    transition: 'all 300ms ease',
                }}
            >Entrepreneur</button>

            {/* Hint */}
            <AnimatePresence>
                {!hinted && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        style={{
                            position: 'absolute', bottom: 14, left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
                            color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.28)',
                            fontFamily: '"DM Sans", sans-serif', fontWeight: 500,
                            zIndex: 3, whiteSpace: 'nowrap',
                            background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
                            backdropFilter: 'blur(6px)',
                            WebkitBackdropFilter: 'blur(6px)',
                            padding: '4px 12px', borderRadius: 999,
                        }}
                    >← Drag anywhere to explore →</motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function About({ theme }: AboutProps) {
    const isDark = theme === 'dark'
    const p = pal(isDark)

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');
            `}</style>

            <section
                id="about"
                style={{
                    position: 'relative',
                    background: p.bg, color: p.fg,
                    fontFamily: '"DM Sans", sans-serif',
                    transition: 'background 0.4s ease, color 0.4s ease',
                    overflow: 'hidden',
                    paddingBottom: '8vh',
                }}
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.8, ease: EASE }}
                    style={{ padding: '10vh 44px 0' }}
                >
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        marginBottom: 'clamp(24px, 3vh, 40px)',
                    }}>
                        <span style={{
                            fontSize: 10, letterSpacing: '0.24em',
                            textTransform: 'uppercase', color: p.muted, fontWeight: 500,
                            transition: 'color 0.4s ease',
                        }}>About</span>
                        <div style={{
                            flex: 1, height: 1, background: p.rule,
                            transition: 'background 0.4s ease',
                        }} />
                    </div>

                    <h2 style={{
                        fontSize: 'clamp(26px, 3.8vw, 52px)',
                        fontFamily: '"Playfair Display", Georgia, serif',
                        fontWeight: 400, lineHeight: 1.15,
                        margin: '0 0 14px', letterSpacing: '-0.01em',
                        color: p.fg, transition: 'color 0.4s ease',
                    }}>
                        I like building things
                    </h2>

                    <p style={{
                        fontSize: 'clamp(14px, 1.2vw, 17px)',
                        color: p.mid, margin: '0 0 5vh',
                        fontWeight: 400, lineHeight: 1.55,
                        maxWidth: 540, transition: 'color 0.4s ease',
                    }}>
                        Whether it's{' '}
                        <span style={{
                            fontFamily: '"DM Mono", monospace',
                            color: p.blue, transition: 'color 0.4s ease',
                        }}>software</span>
                        {' '}or a{' '}
                        <span style={{
                            fontFamily: '"Playfair Display", Georgia, serif',
                            fontStyle: 'italic',
                        }}>company</span>
                        .{' '}CS Engineering at Tec de Monterrey,
                        bilingual in English and Spanish, based in Querétaro, Mexico.
                    </p>
                </motion.div>

                {/* Slider */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.8 }}
                >
                    <SplitPanel isDark={isDark} />
                </motion.div>
            </section>
        </>
    )
}