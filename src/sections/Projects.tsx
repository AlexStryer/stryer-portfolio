import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Theme } from '../hooks/useTheme'
import { pal as basePal } from '../utils/palette'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProjectsProps {
    theme: Theme
}

interface Project {
    title: string
    summary: string
    details: string[]
    stack: string[]
    image: string
    background: string
    link?: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const CARD_EASE: [number, number, number, number] = [0.4, 0, 0.15, 1]

// ── Extended palette (adds card-specific tokens) ──────────────────────────────

function pal(isDark: boolean) {
    const base = basePal(isDark)
    return {
        ...base,
        // Card surfaces — progressively darker/lighter for stacked depth
        card: isDark ? '#0e0e16' : '#ffffff',
        stack1: isDark ? '#0c0c13' : '#f8f8fb',
        stack2: isDark ? '#0a0a10' : '#f2f2f6',
        stack3: isDark ? '#08080d' : '#ececf1',
        cardBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        stackBorder: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        cardShadow: isDark
            ? '0 16px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)'
            : '0 16px 60px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.04)',
        stackShadow: isDark
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 4px 20px rgba(0,0,0,0.04)',
        imgBg: isDark ? '#08080e' : '#f0f0f5',
        // CTA button
        btnBg: isDark ? 'rgba(96,165,250,0.08)' : 'rgba(37,99,235,0.05)',
        btnBorder: isDark ? 'rgba(96,165,250,0.2)' : 'rgba(37,99,235,0.15)',
        btnHover: isDark ? 'rgba(96,165,250,0.14)' : 'rgba(37,99,235,0.1)',
    }
}

// ── Project data ──────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
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
        background: 'background-banu.png',
        link: 'https://banu.com.mx',
    },
    {
        title: 'Excalibur CRM',
        summary:
            'A CRM for leads and quotation workflows — vendors create quotes, direction approves or rejects, and inventory tracking connects to the process.',
        details: [
            'Built the full quotation pipeline with role-based access (vendor, director, admin)',
            'Designed inventory and import tracking modules connected to the sales funnel',
            'Developed a responsive dashboard for real-time lead and quote status monitoring',
        ],
        stack: ['React', 'TypeScript', 'Tailwind'],
        image: 'project-excalibur.png',
        background: 'background-excalibur.png',
    },
    {
        title: 'Habitree – Habit Tracker',
        summary:
            'A Duolingo-inspired habit-tracking mobile app built for Habitree, a sustainability company. Led a team of eight designers as Product Owner.',
        details: [
            'Created all UI/UX flows and mockups in Figma, managing cross-team communication',
            'Developed the iOS version using Swift with gamified habit streaks',
            'Implemented an AWS database and developer web console for data administration',
            'Presented the final product in English to international partners',
        ],
        stack: ['Swift', 'AWS', 'Figma'],
        image: 'project-habitree.png',
        background: 'background-habitree.png',
        link: 'https://www.youtube.com/watch?v=80BD0YFcIFU',
    },
    {
        title: 'Leadly',
        summary:
            'A CRM web application for client lead management, used by local businesses to organize customer information and track leads.',
        details: [
            'Built the backend with Python (Django) and SQLite for customer data',
            'Developed a responsive frontend using HTMX and JavaScript',
            'Designed the data model around real business workflows for jewelry retail',
        ],
        stack: ['Django', 'SQLite', 'HTMX', 'JavaScript'],
        image: 'project-socialflash.png',
        background: 'background-leadly.png',
    },
    {
        title: 'Dehesa San Isidro',
        summary:
            'A deployed branded landing page/site. A lot of the discussion around this one involved GitHub Pages, domains, DNS, HTTPS, and deployment issues.',
        details: [
            'Built and deployed a branded site using React, TypeScript, and Tailwind',
            'Configured GitHub Pages with custom domain, DNS records, and HTTPS',
            'Set up GitHub Actions for automated CI/CD deployment pipeline',
            'Resolved cross-browser and mobile-responsive layout issues',
        ],
        stack: ['React', 'TypeScript', 'Tailwind', 'GitHub Pages', 'GitHub Actions'],
        image: 'project-dis.png',
        background: 'background-dsi.png',
        link: 'https://dehesasanisidro.com',
    },
    {
        title: 'Flash Point: Simpsons Edition',
        summary:
            'A Simpsons-themed adaptation of Flash Point with real-time gameplay playback using a Python simulation layer and a Unity visualization client.',
        details: [
            'Designed a Python server producing JSON game state updates and event logs per turn',
            'Implemented Unity C# scripts that parse JSON frames into live animations',
            'Built a presentation-focused experience with custom assets and intro animations',
            'Structured gameplay logic to keep state deterministic and replayable across runs',
        ],
        stack: ['Unity', 'Python', 'C#'],
        image: 'project-flashpoint.png',
        background: 'background-flashpoint.png',
        link: 'https://canva.link/ijxcsy2se28si5g',
    },
]

const COUNT = PROJECTS.length

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** Returns true when viewport width is below the given breakpoint. */
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

// ── Stack geometry ────────────────────────────────────────────────────────────

const STACK_X_DESKTOP = 18
const STACK_Y_DESKTOP = -22
const STACK_SCALE_DESKTOP = 0.035

const STACK_X_MOBILE = 8
const STACK_Y_MOBILE = -14
const STACK_SCALE_MOBILE = 0.04

/** Computes position, scale, and opacity for a card at a given stack depth. */
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

// ── ProjectCard ───────────────────────────────────────────────────────────────

/**
 * A single project card. Renders as an absolute-positioned layer inside the
 * card deck, animated to its current stack depth position. Only the front
 * card (depth 0) is interactive.
 */
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
            animate={{ x: pos.x, y: pos.y, scale: pos.scale, opacity: pos.opacity }}
            transition={{ duration: 0.65, ease: CARD_EASE }}
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
                    gridTemplateRows: isMobile ? 'minmax(150px, 0.8fr) 1fr' : '1fr',
                    borderRadius: isMobile ? 14 : 16,
                    overflow: 'hidden',
                    background: stackBgs[Math.min(depth, stackBgs.length - 1)],
                    border: `1px solid ${isFront ? p.cardBorder : p.stackBorder}`,
                    boxShadow: isFront ? p.cardShadow : p.stackShadow,
                    transition: 'background 0.5s, border-color 0.5s, box-shadow 0.5s',
                }}
            >
                {/* ── Image panel ── */}
                <div
                    style={{
                        position: 'relative',
                        overflow: 'hidden',
                        background: p.imgBg,
                        transition: 'background 0.4s',
                        minHeight: isMobile ? 150 : undefined,
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
                            (e.target as HTMLImageElement).style.display = 'none'
                        }}
                    />

                    {/* Fallback label (visible if image fails) */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: p.muted,
                        fontSize: isMobile ? 11 : 14,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        fontFamily: '"DM Mono", monospace',
                        pointerEvents: 'none',
                        zIndex: 0,
                    }}>
                        {project.title}
                    </div>

                    {/* Index badge */}
                    <div style={{
                        position: 'absolute', top: 10, left: 10,
                        fontSize: 11, color: '#fff',
                        fontFamily: '"DM Mono", monospace', fontWeight: 500,
                        background: 'rgba(0,0,0,0.35)',
                        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                        padding: '4px 10px', borderRadius: 8, zIndex: 1,
                    }}>
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
                                position: 'absolute', bottom: 10, left: 10,
                                fontSize: 11, color: '#fff',
                                fontFamily: '"DM Mono", monospace', fontWeight: 500,
                                background: 'rgba(0,0,0,0.35)',
                                backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                                padding: '4px 10px', borderRadius: 8,
                                textDecoration: 'none', zIndex: 1,
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.55)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.35)')}
                        >
                            View live ↗
                        </a>
                    )}
                </div>

                {/* ── Content panel ── */}
                <div style={{
                    display: 'flex', flexDirection: 'column',
                    justifyContent: isMobile ? 'flex-start' : 'center',
                    padding: isMobile ? 'clamp(14px, 3vw, 20px)' : 'clamp(20px, 2.2vw, 32px)',
                    overflow: 'hidden',
                }}>
                    {/* Title */}
                    <h3 style={{
                        fontSize: isMobile ? 'clamp(16px, 4.5vw, 20px)' : 'clamp(18px, 1.8vw, 25px)',
                        fontFamily: '"Playfair Display", Georgia, serif',
                        fontWeight: 400,
                        color: p.fg,
                        margin: '0 0 6px',
                        lineHeight: 1.25,
                        transition: 'color 0.4s',
                    }}>
                        {project.title}
                    </h3>

                    {/* Summary */}
                    <p style={{
                        fontSize: isMobile ? 'clamp(11.5px, 3vw, 13px)' : 'clamp(12.5px, 1vw, 14px)',
                        lineHeight: 1.6,
                        color: p.mid,
                        margin: '0 0 12px',
                        fontFamily: '"DM Sans", sans-serif',
                        transition: 'color 0.4s',
                    }}>
                        {project.summary}
                    </p>

                    {/* Stack tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                        {project.stack.map((tag) => (
                            <span key={tag} style={{
                                fontSize: 10,
                                color: p.blue,
                                padding: '3px 9px',
                                borderRadius: 4,
                                border: `1px solid ${p.btnBorder}`,
                                background: p.blueFaint,
                                fontFamily: '"DM Mono", monospace',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.4s',
                            }}>
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
                            display: 'flex', alignItems: 'center', gap: 5,
                            cursor: 'pointer', userSelect: 'none',
                        }}
                    >
                        <span style={{
                            fontSize: 11, color: p.muted,
                            fontFamily: '"DM Sans", sans-serif', fontWeight: 500,
                        }}>
                            {expandedIndex === projectIndex ? 'Show less' : 'More details'}
                        </span>
                        <motion.span
                            animate={{ rotate: expandedIndex === projectIndex ? 180 : 0 }}
                            transition={{ duration: 0.25 }}
                            style={{ fontSize: 8, color: p.muted, display: 'inline-block' }}
                        >▼</motion.span>
                    </div>

                    {/* Expandable detail list */}
                    <AnimatePresence>
                        {expandedIndex === projectIndex && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: EASE }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{
                                    paddingTop: 10, marginTop: 10,
                                    borderTop: `1px solid ${p.rule}`,
                                    display: 'flex', flexDirection: 'column', gap: 5,
                                }}>
                                    {project.details.map((detail, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                                            <span style={{
                                                fontSize: 9, color: p.blue,
                                                fontFamily: '"DM Mono", monospace',
                                                marginTop: 4, flexShrink: 0,
                                            }}>→</span>
                                            <span style={{
                                                fontSize: isMobile ? 11.5 : 12.5,
                                                lineHeight: 1.5, color: p.mid,
                                                fontFamily: '"DM Sans", sans-serif',
                                            }}>
                                                {detail}
                                            </span>
                                        </div>
                                    ))}
                                    {/* Live link inside expanded details if available */}
                                    {project.link && (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                fontSize: 11, color: p.blue,
                                                fontFamily: '"DM Mono", monospace',
                                                textDecoration: 'none',
                                                marginTop: 4,
                                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                            }}
                                        >
                                            {project.link.replace('https://', '')} ↗
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}

// ── CardDeck (manages stack state + input handlers) ───────────────────────────

/**
 * The card deck container. Manages:
 * - Card ordering (which card is on top)
 * - Scroll/swipe/keyboard interception when hovering over the card stack
 * - Progress dots for direct navigation
 */
function CardDeck({ isDark }: { isDark: boolean }) {
    const p = pal(isDark)
    const cardStackRef = useRef<HTMLDivElement>(null)
    const isMobile = useIsMobile()

    // order[0] = front card index
    const [order, setOrder] = useState(PROJECTS.map((_, i) => i))
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
    const [movingCard, setMovingCard] = useState<number | null>(null)
    const [moveDirection, setMoveDirection] = useState<'toBack' | 'toFront'>('toBack')

    const busy = useRef(false)
    const cycleRef = useRef(0)

    // Hover tracking — used for keyboard navigation
    const isHovering = useRef(false)

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

    // ── Cycle helpers ─────────────────────────────────────────────

    /** Send the front card to the back of the stack. */
    const cycleForward = useCallback(() => {
        if (busy.current) return
        busy.current = true
        setExpandedIndex(null)

        const frontCard = order[0]
        setMovingCard(frontCard)
        setMoveDirection('toBack')
        setOrder((prev) => [...prev.slice(1), prev[0]])
        cycleRef.current = (cycleRef.current + 1) % COUNT

        setTimeout(() => { setMovingCard(null); busy.current = false }, 450)
    }, [order])

    /** Bring the back card to the front of the stack. */
    const cycleBackward = useCallback(() => {
        if (busy.current) return
        busy.current = true
        setExpandedIndex(null)

        const backCard = order[order.length - 1]
        setMovingCard(backCard)
        setMoveDirection('toFront')
        setOrder((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)])
        cycleRef.current = (cycleRef.current - 1 + COUNT) % COUNT

        setTimeout(() => { setMovingCard(null); busy.current = false }, 450)
    }, [order])

    /** Navigate to a specific card — takes the shortest path around the loop. */
    const goToCard = useCallback(
        (targetIndex: number) => {
            if (busy.current || order[0] === targetIndex) return

            const currentPos = order.indexOf(targetIndex)
            const stepsForward = currentPos
            const stepsBackward = COUNT - currentPos

            const step = (fn: () => void, remaining: number) => {
                if (remaining <= 0) return
                setTimeout(() => { fn(); step(fn, remaining - 1) }, 480)
            }

            if (stepsForward <= stepsBackward) {
                cycleForward()
                step(cycleForward, stepsForward - 1)
            } else {
                cycleBackward()
                step(cycleBackward, stepsBackward - 1)
            }
        },
        [order, cycleForward, cycleBackward],
    )

    // ── Input handlers ────────────────────────────────────────────

    /** Arrow keys — only when hovering. */
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (!isHovering.current) return
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault(); cycleForward()
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault(); cycleBackward()
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [cycleForward, cycleBackward])

    /** Touch swipe — supports vertical and horizontal swipes on the card area. */
    const touchStartY = useRef(0)
    const touchStartX = useRef(0)
    const touchInsideDeck = useRef(false)

    useEffect(() => {
        const stack = cardStackRef.current
        if (!stack) return

        const onStart = (e: TouchEvent) => {
            const touch = e.touches[0]
            const rect = stack.getBoundingClientRect()
            touchInsideDeck.current =
                touch.clientX >= rect.left &&
                touch.clientX <= rect.right &&
                touch.clientY >= rect.top &&
                touch.clientY <= rect.bottom
            touchStartY.current = touch.clientY
            touchStartX.current = touch.clientX
        }
        const onEnd = (e: TouchEvent) => {
            if (!touchInsideDeck.current) return
            const diffY = touchStartY.current - e.changedTouches[0].clientY
            const diffX = touchStartX.current - e.changedTouches[0].clientX
            // Use whichever axis had more movement
            const useX = Math.abs(diffX) > Math.abs(diffY)
            const diff = useX ? diffX : diffY
            if (Math.abs(diff) < 30) return
            if (diff > 0) cycleForward()
            else if (diff < 0) cycleBackward()
        }
        window.addEventListener('touchstart', onStart, { passive: true })
        window.addEventListener('touchend', onEnd, { passive: true })
        return () => {
            window.removeEventListener('touchstart', onStart)
            window.removeEventListener('touchend', onEnd)
        }
    }, [cycleForward, cycleBackward])

    const stackX = isMobile ? STACK_X_MOBILE : STACK_X_DESKTOP
    const stackY = isMobile ? STACK_Y_MOBILE : STACK_Y_DESKTOP
    const activeProject = PROJECTS[order[0]]

    // ── Render ────────────────────────────────────────────────────

    return (
        <section
            id="projects"
            style={{
                position: 'relative',
                background: p.bg,
                color: p.fg,
                fontFamily: '"DM Sans", sans-serif',
                transition: 'background 0.4s, color 0.4s',
                minHeight: isMobile ? 'auto' : '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* ── Section header ── */}
            <div style={{
                padding: isMobile
                    ? 'clamp(16px, 3vh, 24px) clamp(16px, 4vw, 24px) 0'
                    : 'clamp(24px, 4vh, 36px) clamp(28px, 5vw, 64px) 0',
                display: 'flex',
                alignItems: isMobile ? 'flex-start' : 'flex-end',
                justifyContent: 'space-between',
                flexDirection: isMobile ? 'column' : 'row',
                flexWrap: 'wrap',
                gap: isMobile ? 16 : 12,
                flexShrink: 0,
            }}>
                <div>
                    {/* Label + rule */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        marginBottom: 'clamp(8px, 1.5vh, 16px)',
                    }}>
                        <span style={{
                            fontSize: 10, letterSpacing: '0.24em',
                            textTransform: 'uppercase', color: p.muted,
                            fontWeight: 500, transition: 'color 0.4s',
                        }}>Projects</span>
                        <div style={{
                            width: 40, height: 1,
                            background: p.rule, transition: 'background 0.4s',
                        }} />
                    </div>

                    <h2 style={{
                        fontSize: isMobile ? 'clamp(22px, 7vw, 32px)' : 'clamp(24px, 3.5vw, 48px)',
                        fontFamily: '"Playfair Display", Georgia, serif',
                        fontWeight: 400, lineHeight: 1.15,
                        margin: 0, color: p.fg, transition: 'color 0.4s',
                    }}>
                        Selected work
                    </h2>
                </div>

                {/* GitHub repo link */}
                <a
                    href="https://github.com/AlexStryer/stryer-portfolio"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        fontSize: 10, letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: p.muted,
                        fontFamily: '"DM Mono", monospace', fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'color 0.3s ease',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = p.blue }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = p.muted }}
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    Source code ↗
                </a>
            </div>

            {/* ── Card deck area ── */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: isMobile
                        ? '0 clamp(12px, 3vw, 20px)'
                        : '0 clamp(28px, 5vw, 64px)',
                    paddingBottom: isMobile ? 'clamp(48px, 7vh, 64px)' : 'clamp(56px, 7vh, 80px)',
                    paddingTop: isMobile ? 'clamp(8px, 1.5vh, 16px)' : 'clamp(16px, 2vh, 32px)',
                    minHeight: isMobile ? 'clamp(380px, 56vh, 480px)' : 'clamp(440px, 52vh, 580px)',
                }}
            >
                {/* Hover zone — wraps the background stage and card stack */}
                <div
                    ref={cardStackRef}
                    onMouseEnter={() => { isHovering.current = true }}
                    onMouseLeave={() => { isHovering.current = false }}
                    style={{
                        position: 'relative',
                        width: isMobile ? 'min(92vw, 420px)' : 'min(88vw, 1280px)',
                        height: isMobile ? 'clamp(420px, 62vh, 560px)' : 'clamp(420px, 46vw, 760px)',
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeProject.background}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, ease: EASE }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                zIndex: 0,
                                overflow: 'hidden',
                                borderRadius: isMobile ? 18 : 24,
                                background: p.imgBg,
                            }}
                        >
                            <img
                                src={`${import.meta.env.BASE_URL}${activeProject.background}`}
                                alt=""
                                aria-hidden="true"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    display: 'block',
                                }}
                                onError={(e) => {
                                    ; (e.target as HTMLImageElement).style.display = 'none'
                                }}
                            />
                        </motion.div>
                    </AnimatePresence>

                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: isMobile ? '20px 12px 54px' : '32px 24px 70px',
                        }}
                    >
                        <div style={{
                            position: 'relative',
                            width: isMobile ? 'min(88vw, 380px)' : 'min(84vw, 920px)',
                            height: isMobile ? 'clamp(340px, 50vh, 440px)' : 'clamp(340px, 36vw, 440px)',
                            marginRight: isMobile ? COUNT * stackX : COUNT * stackX + 20,
                            marginTop: isMobile ? COUNT * Math.abs(stackY) + 8 : COUNT * Math.abs(stackY) + 20,
                        }}>
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

                    {/* ── Navigation arrows ── */}
                    {!isMobile && (
                        <>
                            <button
                                onClick={() => cycleBackward()}
                                aria-label="Previous project"
                                style={{
                                    position: 'absolute',
                                    left: 10, top: '50%', transform: 'translateY(-50%)',
                                    zIndex: 2,
                                    width: 36, height: 36, borderRadius: 999,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(0,0,0,0.35)',
                                    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                                    border: 'none', cursor: 'pointer',
                                    opacity: 0.8,
                                    color: '#fff', fontSize: 14,
                                    transition: 'opacity 0.25s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
                                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.8' }}
                            >←</button>
                            <button
                                onClick={() => cycleForward()}
                                aria-label="Next project"
                                style={{
                                    position: 'absolute',
                                    right: 10, top: '50%', transform: 'translateY(-50%)',
                                    zIndex: 2,
                                    width: 36, height: 36, borderRadius: 999,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(0,0,0,0.35)',
                                    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                                    border: 'none', cursor: 'pointer',
                                    opacity: 0.8,
                                    color: '#fff', fontSize: 14,
                                    transition: 'opacity 0.25s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
                                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.8' }}
                            >→</button>
                        </>
                    )}
                </div>
            </div>

            {/* ── Progress dots ── */}
            <div style={{
                position: 'absolute',
                bottom: isMobile ? 'clamp(12px, 2vh, 20px)' : 'clamp(16px, 2.5vh, 28px)',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex', gap: 8, alignItems: 'center',
            }}>
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
                                background: isActive ? p.blue : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'),
                                transition: 'all 0.4s',
                                cursor: 'pointer',
                                border: 'none',
                                /* Invisible padding for bigger touch target on mobile */
                                padding: isMobile ? '12px 6px' : 0,
                                boxSizing: 'content-box',
                                outline: 'none',
                                WebkitTapHighlightColor: 'transparent',
                            }}
                        />
                    )
                })}
                <span style={{
                    fontSize: 10, color: p.muted,
                    fontFamily: '"DM Sans", sans-serif', marginLeft: 4,
                }}>
                    {isMobile ? 'Swipe to browse' : 'Click to browse'}
                </span>
            </div>
        </section>
    )
}

// ── Export ─────────────────────────────────────────────────────────────────────

/** Projects section — card deck with scroll-driven navigation. */
export default function Projects({ theme }: ProjectsProps) {
    return <CardDeck isDark={theme === 'dark'} />
}