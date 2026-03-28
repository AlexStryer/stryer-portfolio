import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Theme } from '../hooks/useTheme'

interface ProjectsProps {
    theme: Theme
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const CARD_EASE: [number, number, number, number] = [0.4, 0, 0.15, 1]

/* ── palette ────────────────────────────────────────────────────────────── */
function pal(isDark: boolean) {
    return {
        bg: isDark ? '#000' : '#fff',
        fg: isDark ? '#f0f0f0' : '#0a0a0a',
        mid: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
        muted: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.2)',
        rule: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        card: isDark ? '#0d0d15' : '#ffffff',
        stack1: isDark ? '#0b0b12' : '#f8f8fb',
        stack2: isDark ? '#09090f' : '#f2f2f6',
        stack3: isDark ? '#07070c' : '#ececf1',
        cardBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        stackBorder: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        cardShadow: isDark
            ? '0 16px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)'
            : '0 16px 60px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.04)',
        stackShadow: isDark
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 4px 20px rgba(0,0,0,0.04)',
        blue: isDark ? '#60a5fa' : '#2563eb',
        blueFaint: isDark ? 'rgba(96,165,250,0.08)' : 'rgba(37,99,235,0.06)',
        blueBorder: isDark ? 'rgba(96,165,250,0.14)' : 'rgba(37,99,235,0.1)',
        blueGlow: isDark ? 'rgba(96,165,250,0.15)' : 'rgba(37,99,235,0.1)',
        imgBg: isDark ? '#08080e' : '#f0f0f5',
        btnColor: isDark ? '#60a5fa' : '#2563eb',
        btnBg: isDark ? 'rgba(96,165,250,0.08)' : 'rgba(37,99,235,0.05)',
        btnBorder: isDark ? 'rgba(96,165,250,0.2)' : 'rgba(37,99,235,0.15)',
        btnHover: isDark ? 'rgba(96,165,250,0.14)' : 'rgba(37,99,235,0.1)',
    }
}

/* ── project data ───────────────────────────────────────────────────────── */
interface Project {
    title: string
    summary: string
    details: string[]
    stack: string[]
    image: string
    link?: string
}

const PROJECTS: Project[] = [
    {
        title: 'Flash Point: Simpsons Edition',
        summary:
            'A Simpsons themed adaptation of Flash Point with real time gameplay playback using a Python simulation layer and a Unity visualization client.',
        details: [
            'Designed a Python server that produces JSON game state updates and event logs for each turn',
            'Implemented Unity C# scripts that parse JSON frames and translate them into live animations',
            'Built a presentation focused experience with custom assets and intro animations',
            'Structured gameplay logic to keep state deterministic and replayable across runs',
        ],
        stack: ['Unity', 'Python', 'C#'],
        image: 'project-flashpoint.png',
        link: 'https://www.canva.com/design/DAG6jnOz02Q/FdYyQUDahSUbZ4xKleCRag/edit',
    },
    {
        title: 'Banu Software Agency',
        summary:
            'Co-founded a web development agency focused on digitizing local companies. Delivered production websites from Figma handoff to deployment.',
        details: [
            'Built and shipped React, TypeScript, Tailwind websites for local businesses',
            'Owned client discovery and delivery workflow with clear technical scope',
            'Managed SEO improvements, positioning, and lead generation for clients',
        ],
        stack: ['React', 'TypeScript', 'Tailwind'],
        image: 'project-banu.png',
        link: 'https://banu.com.mx',
    },
    {
        title: 'DSI Landing Page',
        summary:
            'Built a fast turnaround landing page for a local business, customized and deployed with a custom domain.',
        details: [
            'Used Lovable to scaffold a structured, clean codebase quickly',
            'Customized the design and code to match the client brand',
            'Deployed on GitHub Pages with custom domain connection',
            'Replicated this workflow for other companies at accessible pricing',
        ],
        stack: ['React', 'TypeScript', 'Tailwind', 'Lovable'],
        image: 'project-dsi.png',
        link: 'https://dehesasanisidro.com',
    },
    {
        title: 'Social Flash CRM',
        summary:
            'A CRM web application for client lead management, used by local businesses to organize customer information and track leads.',
        details: [
            'Built the backend with Python (Django) and SQLite for customer data',
            'Developed a responsive frontend using HTMX and JavaScript',
            'Designed the data model around real business workflows for jewelry retail',
        ],
        stack: ['Django', 'SQLite', 'HTMX', 'JavaScript'],
        image: 'project-socialflash.png',
    },
]

const COUNT = PROJECTS.length

/* ── responsive hook ────────────────────────────────────────────────────── */
function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < breakpoint)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [breakpoint])
    return isMobile
}

/* ── stack geometry ─────────────────────────────────────────────────────── */
const STACK_X_DESKTOP = 18
const STACK_Y_DESKTOP = -22
const STACK_SCALE_DESKTOP = 0.035

const STACK_X_MOBILE = 8
const STACK_Y_MOBILE = -14
const STACK_SCALE_MOBILE = 0.04

function depthPosition(depth: number, isMobile: boolean) {
    const sx = isMobile ? STACK_X_MOBILE : STACK_X_DESKTOP
    const sy = isMobile ? STACK_Y_MOBILE : STACK_Y_DESKTOP
    const ss = isMobile ? STACK_SCALE_MOBILE : STACK_SCALE_DESKTOP
    return {
        x: depth * sx,
        y: depth * sy,
        scale: 1 - depth * ss,
        opacity: depth === 0 ? 1 : Math.max(0.4, 1 - depth * 0.18),
    }
}

/* ── ProjectCard ────────────────────────────────────────────────────────── */
function ProjectCard({
    project,
    projectIndex,
    depth,
    zIndex,
    isDark,
    isMobile,
    expandedIndex,
    setExpandedIndex,
}: {
    project: Project
    projectIndex: number
    depth: number
    zIndex: number
    isDark: boolean
    isMobile: boolean
    expandedIndex: number | null
    setExpandedIndex: (v: number | null) => void
}) {
    const p = pal(isDark)
    const isFront = depth === 0
    const stackBgs = [p.card, p.stack1, p.stack2, p.stack3]
    const pos = depthPosition(depth, isMobile)

    return (
        <motion.div
            animate={{
                x: pos.x,
                y: pos.y,
                scale: pos.scale,
                opacity: pos.opacity,
            }}
            transition={{
                duration: 0.65,
                ease: CARD_EASE,
            }}
            style={{
                position: 'absolute',
                inset: 0,
                zIndex,
                transformOrigin: 'center bottom',
                pointerEvents: isFront ? 'auto' : 'none',
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1.05fr 1fr',
                    gridTemplateRows: isMobile ? 'minmax(180px, 0.9fr) 1fr' : '1fr',
                    borderRadius: isMobile ? 14 : 16,
                    overflow: 'hidden',
                    background: stackBgs[Math.min(depth, stackBgs.length - 1)],
                    border: `1px solid ${isFront ? p.cardBorder : p.stackBorder}`,
                    boxShadow: isFront ? p.cardShadow : p.stackShadow,
                    transition: 'background 0.5s, border-color 0.5s, box-shadow 0.5s',
                }}
            >
                {/* ── Image ── */}
                <div
                    style={{
                        position: 'relative',
                        overflow: 'hidden',
                        background: p.imgBg,
                        transition: 'background 0.4s',
                        minHeight: isMobile ? 180 : undefined,
                    }}
                >
                    <img
                        src={`${import.meta.env.BASE_URL}${project.image}`}
                        alt={project.title}
                        loading="lazy"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                        }}
                        onError={(e) => {
                            ; (e.target as HTMLImageElement).style.display = 'none'
                        }}
                    />
                    {/* Fallback label behind the image */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: p.muted,
                            fontSize: isMobile ? 11 : 14,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            fontFamily: '"DM Mono", monospace',
                            pointerEvents: 'none',
                            zIndex: 0,
                        }}
                    >
                        {project.title}
                    </div>
                    {/* Index badge */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            fontSize: 11,
                            color: '#fff',
                            fontFamily: '"DM Mono", monospace',
                            fontWeight: 500,
                            background: 'rgba(0,0,0,0.35)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            padding: '4px 10px',
                            borderRadius: 8,
                            zIndex: 1,
                        }}
                    >
                        {String(projectIndex + 1).padStart(2, '0')}
                    </div>
                    {/* View live link */}
                    {project.link && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                position: 'absolute',
                                bottom: 10,
                                left: 10,
                                fontSize: 11,
                                color: '#fff',
                                fontFamily: '"DM Mono", monospace',
                                fontWeight: 500,
                                background: 'rgba(0,0,0,0.35)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                padding: '4px 10px',
                                borderRadius: 8,
                                textDecoration: 'none',
                                transition: 'background 0.2s',
                                zIndex: 1,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(0,0,0,0.55)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(0,0,0,0.35)'
                            }}
                        >
                            View live ↗
                        </a>
                    )}
                </div>

                {/* ── Content ── */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: isMobile ? 'flex-start' : 'center',
                        padding: isMobile
                            ? 'clamp(14px, 3vw, 20px)'
                            : 'clamp(20px, 2.2vw, 32px)',
                        overflow: 'hidden',
                    }}
                >
                    <h3
                        style={{
                            fontSize: isMobile
                                ? 'clamp(16px, 4.5vw, 20px)'
                                : 'clamp(18px, 1.8vw, 25px)',
                            fontFamily: '"Playfair Display", Georgia, serif',
                            fontWeight: 400,
                            color: p.fg,
                            margin: '0 0 6px',
                            lineHeight: 1.25,
                            transition: 'color 0.4s',
                        }}
                    >
                        {project.title}
                    </h3>
                    <p
                        style={{
                            fontSize: isMobile
                                ? 'clamp(11.5px, 3vw, 13px)'
                                : 'clamp(12.5px, 1vw, 14px)',
                            lineHeight: 1.6,
                            color: p.mid,
                            margin: '0 0 12px',
                            fontFamily: '"DM Sans", sans-serif',
                            transition: 'color 0.4s',
                        }}
                    >
                        {project.summary}
                    </p>
                    {/* Stack tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                        {project.stack.map((tag) => (
                            <span
                                key={tag}
                                style={{
                                    fontSize: 10,
                                    color: p.blue,
                                    padding: '3px 9px',
                                    borderRadius: 4,
                                    border: `1px solid ${p.blueBorder}`,
                                    background: p.blueFaint,
                                    fontFamily: '"DM Mono", monospace',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.4s',
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    {/* More details toggle */}
                    <div
                        onClick={(e) => {
                            e.stopPropagation()
                            setExpandedIndex(expandedIndex === projectIndex ? null : projectIndex)
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            cursor: 'pointer',
                            userSelect: 'none',
                        }}
                    >
                        <span
                            style={{
                                fontSize: 11,
                                color: p.muted,
                                fontFamily: '"DM Sans", sans-serif',
                                fontWeight: 500,
                            }}
                        >
                            {expandedIndex === projectIndex ? 'Show less' : 'More details'}
                        </span>
                        <motion.span
                            animate={{ rotate: expandedIndex === projectIndex ? 180 : 0 }}
                            transition={{ duration: 0.25 }}
                            style={{ fontSize: 8, color: p.muted, display: 'inline-block' }}
                        >
                            ▼
                        </motion.span>
                    </div>
                    {/* Expandable details */}
                    <AnimatePresence>
                        {expandedIndex === projectIndex && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: EASE }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div
                                    style={{
                                        paddingTop: 10,
                                        marginTop: 10,
                                        borderTop: `1px solid ${p.rule}`,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 5,
                                    }}
                                >
                                    {project.details.map((detail, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                gap: 7,
                                                alignItems: 'flex-start',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: 9,
                                                    color: p.blue,
                                                    fontFamily: '"DM Mono", monospace',
                                                    marginTop: 4,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                →
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: isMobile ? 11.5 : 12.5,
                                                    lineHeight: 1.5,
                                                    color: p.mid,
                                                    fontFamily: '"DM Sans", sans-serif',
                                                }}
                                            >
                                                {detail}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}

/* ── CardDeck ───────────────────────────────────────────────────────────── */
function CardDeck({ isDark }: { isDark: boolean }) {
    const p = pal(isDark)
    const deckRef = useRef<HTMLDivElement>(null)
    const isMobile = useIsMobile()

    // order[0] = front card index, order[N-1] = back
    const [order, setOrder] = useState(PROJECTS.map((_, i) => i))
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
    const [movingCard, setMovingCard] = useState<number | null>(null)
    const [moveDirection, setMoveDirection] = useState<'toBack' | 'toFront'>('toBack')

    const busy = useRef(false)
    const cycleRef = useRef(0)
    const lastWheelTime = useRef(0)

    // Dwell timer — lock scroll only after deck centered for 300ms
    const centeredSince = useRef<number | null>(null)
    const DWELL_MS = 300

    const checkCentered = useCallback(() => {
        const el = deckRef.current
        if (!el) return false
        const rect = el.getBoundingClientRect()
        const viewCenter = window.innerHeight / 2
        if (rect.top > viewCenter) return false
        if (rect.bottom < viewCenter) return false
        const deckCenter = rect.top + rect.height / 2
        return Math.abs(deckCenter - viewCenter) < 150
    }, [])

    useEffect(() => {
        let raf: number
        const tick = () => {
            if (checkCentered()) {
                if (centeredSince.current === null) centeredSince.current = Date.now()
            } else {
                centeredSince.current = null
            }
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [checkCentered])

    const shouldLock = useCallback(() => {
        if (centeredSince.current === null) return false
        return Date.now() - centeredSince.current >= DWELL_MS
    }, [])

    const getDepth = useCallback(
        (projectIndex: number) => order.indexOf(projectIndex),
        [order],
    )

    const getZIndex = useCallback(
        (projectIndex: number) => {
            const depth = order.indexOf(projectIndex)
            if (movingCard === projectIndex) {
                return moveDirection === 'toBack' ? 0 : COUNT + 1
            }
            return COUNT - depth
        },
        [order, movingCard, moveDirection],
    )

    /* ── cycle forward (send front to back) ── */
    const cycleForward = useCallback(() => {
        if (busy.current || cycleRef.current >= COUNT - 1) return
        busy.current = true
        setExpandedIndex(null)

        const frontCard = order[0]
        setMovingCard(frontCard)
        setMoveDirection('toBack')

        setOrder((prev) => [...prev.slice(1), prev[0]])
        cycleRef.current += 1

        setTimeout(() => {
            setMovingCard(null)
            busy.current = false
        }, 680)
    }, [order])

    /* ── cycle backward (bring back to front) ── */
    const cycleBackward = useCallback(() => {
        if (busy.current || cycleRef.current <= 0) return
        busy.current = true
        setExpandedIndex(null)

        const backCard = order[order.length - 1]
        setMovingCard(backCard)
        setMoveDirection('toFront')

        setOrder((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)])
        cycleRef.current -= 1

        setTimeout(() => {
            setMovingCard(null)
            busy.current = false
        }, 680)
    }, [order])

    /* ── go to specific card ── */
    const goToCard = useCallback(
        (targetIndex: number) => {
            if (busy.current) return
            const currentFront = order[0]
            if (currentFront === targetIndex) return

            // Figure out how many cycles needed
            const currentCycle = cycleRef.current
            const targetCycle = targetIndex // since initial order is [0,1,2,3], card N is at cycle N

            if (targetCycle > currentCycle) {
                cycleForward()
                // Chain remaining cycles with delay
                let remaining = targetCycle - currentCycle - 1
                let delay = 700
                const step = () => {
                    if (remaining <= 0) return
                    remaining--
                    setTimeout(() => {
                        cycleForward()
                        step()
                    }, delay)
                }
                step()
            } else {
                cycleBackward()
                let remaining = currentCycle - targetCycle - 1
                let delay = 700
                const step = () => {
                    if (remaining <= 0) return
                    remaining--
                    setTimeout(() => {
                        cycleBackward()
                        step()
                    }, delay)
                }
                step()
            }
        },
        [order, cycleForward, cycleBackward],
    )

    /* ── wheel handler ── */
    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
            if (!shouldLock()) return

            const down = e.deltaY > 0
            const up = e.deltaY < 0

            if (down && cycleRef.current >= COUNT - 1) return
            if (up && cycleRef.current <= 0) return

            e.preventDefault()

            const now = Date.now()
            if (now - lastWheelTime.current < 700) return
            if (Math.abs(e.deltaY) < 20) return
            lastWheelTime.current = now

            if (down) cycleForward()
            else cycleBackward()
        }

        window.addEventListener('wheel', onWheel, { passive: false })
        return () => window.removeEventListener('wheel', onWheel)
    }, [cycleForward, cycleBackward, shouldLock])

    /* ── keyboard ── */
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (!shouldLock()) return
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault()
                cycleForward()
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault()
                cycleBackward()
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [cycleForward, cycleBackward, shouldLock])

    /* ── touch ── */
    const touchStartY = useRef(0)
    useEffect(() => {
        const onStart = (e: TouchEvent) => {
            touchStartY.current = e.touches[0].clientY
        }
        const onEnd = (e: TouchEvent) => {
            if (!shouldLock()) return
            const diff = touchStartY.current - e.changedTouches[0].clientY
            if (Math.abs(diff) < 50) return
            if (diff > 0 && cycleRef.current < COUNT - 1) cycleForward()
            else if (diff < 0 && cycleRef.current > 0) cycleBackward()
        }
        window.addEventListener('touchstart', onStart, { passive: true })
        window.addEventListener('touchend', onEnd, { passive: true })
        return () => {
            window.removeEventListener('touchstart', onStart)
            window.removeEventListener('touchend', onEnd)
        }
    }, [cycleForward, cycleBackward, shouldLock])

    const stackX = isMobile ? STACK_X_MOBILE : STACK_X_DESKTOP
    const stackY = isMobile ? STACK_Y_MOBILE : STACK_Y_DESKTOP

    return (
        <section
            id="projects"
            style={{
                position: 'relative',
                background: p.bg,
                color: p.fg,
                fontFamily: '"DM Sans", sans-serif',
                transition: 'background 0.4s, color 0.4s',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* ── Header ── */}
            <div
                style={{
                    padding: isMobile
                        ? 'clamp(20px, 4vh, 28px) clamp(16px, 4vw, 24px) 0'
                        : 'clamp(24px, 4vh, 36px) clamp(28px, 5vw, 64px) 0',
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                    flexShrink: 0,
                }}
            >
                <div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            marginBottom: 'clamp(8px, 1.5vh, 16px)',
                        }}
                    >
                        <span
                            style={{
                                fontSize: 10,
                                letterSpacing: '0.24em',
                                textTransform: 'uppercase',
                                color: p.muted,
                                fontWeight: 500,
                                transition: 'color 0.4s',
                            }}
                        >
                            Projects
                        </span>
                        <div
                            style={{
                                width: 40,
                                height: 1,
                                background: p.rule,
                                transition: 'background 0.4s',
                            }}
                        />
                    </div>
                    <h2
                        style={{
                            fontSize: isMobile
                                ? 'clamp(22px, 7vw, 32px)'
                                : 'clamp(24px, 3.5vw, 48px)',
                            fontFamily: '"Playfair Display", Georgia, serif',
                            fontWeight: 400,
                            lineHeight: 1.15,
                            margin: 0,
                            color: p.fg,
                            transition: 'color 0.4s',
                        }}
                    >
                        Selected work
                    </h2>
                </div>

                <button
                    style={{
                        fontSize: 12,
                        letterSpacing: '0.04em',
                        color: p.btnColor,
                        fontFamily: '"DM Sans", sans-serif',
                        fontWeight: 500,
                        padding: isMobile ? '8px 18px' : '10px 24px',
                        borderRadius: 999,
                        background: p.btnBg,
                        border: `1px solid ${p.btnBorder}`,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        marginBottom: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = p.btnHover
                        e.currentTarget.style.boxShadow = `0 0 20px ${p.blueGlow}`
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = p.btnBg
                        e.currentTarget.style.boxShadow = 'none'
                    }}
                >
                    See all projects <span style={{ fontSize: 14 }}>→</span>
                </button>
            </div>

            {/* ── Deck area ── */}
            <div
                ref={deckRef}
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: isMobile
                        ? '0 clamp(12px, 3vw, 20px)'
                        : '0 clamp(28px, 5vw, 64px)',
                    paddingBottom: isMobile
                        ? 'clamp(64px, 10vh, 80px)'
                        : 'clamp(56px, 7vh, 80px)',
                    paddingTop: 'clamp(16px, 2vh, 32px)',
                    minHeight: isMobile
                        ? 'clamp(420px, 70vh, 560px)'
                        : 'clamp(440px, 52vh, 580px)',
                }}
            >
                <div
                    style={{
                        position: 'relative',
                        width: isMobile ? 'min(92vw, 400px)' : 'min(84vw, 920px)',
                        height: isMobile
                            ? 'clamp(380px, 60vh, 500px)'
                            : 'clamp(340px, 36vw, 440px)',
                        // Reserve space for stack offsets
                        marginRight: COUNT * stackX + 20,
                        marginTop: COUNT * Math.abs(stackY) + 20,
                    }}
                >
                    {PROJECTS.map((project, projectIndex) => (
                        <ProjectCard
                            key={`card-${projectIndex}`}
                            project={project}
                            projectIndex={projectIndex}
                            depth={getDepth(projectIndex)}
                            zIndex={getZIndex(projectIndex)}
                            isDark={isDark}
                            isMobile={isMobile}
                            expandedIndex={expandedIndex}
                            setExpandedIndex={setExpandedIndex}
                        />
                    ))}
                </div>
            </div>

            {/* ── Progress dots ── */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 'clamp(16px, 2.5vh, 28px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                }}
            >
                {PROJECTS.map((_, i) => {
                    const isActive = order[0] === i
                    return (
                        <button
                            key={i}
                            onClick={() => goToCard(i)}
                            aria-label={`Go to project ${i + 1}`}
                            style={{
                                width: isActive ? 24 : 6,
                                height: 6,
                                borderRadius: 3,
                                background: isActive
                                    ? p.blue
                                    : isDark
                                        ? 'rgba(255,255,255,0.1)'
                                        : 'rgba(0,0,0,0.08)',
                                transition: 'all 0.4s',
                                cursor: 'pointer',
                                border: 'none',
                                padding: 0,
                                outline: 'none',
                            }}
                        />
                    )
                })}
                <span
                    style={{
                        fontSize: 10,
                        color: p.muted,
                        fontFamily: '"DM Sans", sans-serif',
                        marginLeft: 4,
                    }}
                >
                    {isMobile ? 'Swipe to browse' : 'Scroll to browse'}
                </span>
            </div>
        </section>
    )
}

/* ── Export ──────────────────────────────────────────────────────────────── */
export default function Projects({ theme }: ProjectsProps) {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');
            `}</style>
            <CardDeck isDark={theme === 'dark'} />
        </>
    )
}