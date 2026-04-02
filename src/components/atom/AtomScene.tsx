import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Theme } from '../../hooks/useTheme'
import { pal } from '../../utils/palette'

// ── Types ─────────────────────────────────────────────────────────────────────

interface AtomSceneProps {
    theme: Theme
    onToggleTheme: () => void
    onIntroComplete?: () => void
    triggerReplay?: boolean
    onReplayDone?: () => void
}

interface Sphere {
    x: number
    y: number
    size: number
    delay: number
    reverseDelay: number
    dx: number
    dy: number
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TOTAL_FRAMES = 112
const FPS = 30
const FILL_DURATION = 5000
const REVERSE_DURATION = FILL_DURATION / 2
const MOBILE_BREAKPOINT = 768

type Phase = 'filling' | 'frozen' | 'reversing' | 'done'
type AnimState = 'idle' | 'playing' | 'finished'

// ── Universe generation ───────────────────────────────────────────────────────

function generateUniverse(): Sphere[] {
    const raw: { x: number; y: number; size: number; delay: number }[] = []

    raw.push({ x: 50, y: 50, size: 14, delay: 0 })

    const screenArea = window.innerWidth * window.innerHeight
    const baseArea = 1920 * 1080
    const scaleFactor = Math.max(1, screenArea / baseArea)
    const isMobileGen = window.innerWidth < MOBILE_BREAKPOINT

    const BASE_COUNT = isMobileGen ? 140 : 1000
    const TOTAL = isMobileGen ? BASE_COUNT : Math.ceil(BASE_COUNT * scaleFactor)

    const timeScale = FILL_DURATION / 9500

    for (let i = 1; i < TOTAL; i++) {
        const progress = i / TOTAL
        let delay: number

        if (progress < 0.05) {
            delay = 0.8 + (progress / 0.05) * 3.5
        } else if (progress < 0.3) {
            delay = 4.3 + ((progress - 0.05) / 0.25) * 3.0
        } else {
            delay = 7.3 + ((progress - 0.3) / 0.7) * 2.0
        }

        delay = delay * timeScale + (Math.random() - 0.5) * 0.2

        const x = Math.random() * 116 - 8
        const y = Math.random() * 116 - 8
        const minSize = isMobileGen ? 110 : 60 * Math.sqrt(scaleFactor)
        const maxSize = isMobileGen ? 320 : 220 * Math.sqrt(scaleFactor)

        raw.push({
            x,
            y,
            size: minSize + Math.random() * (maxSize - minSize),
            delay,
        })
    }

    const maxDelay = Math.max(...raw.map((s) => s.delay))

    return raw.map((s) => {
        const dx = 50 - s.x
        const dy = 50 - s.y
        const reverseDelay = ((maxDelay - s.delay) / maxDelay) * (maxDelay / 2)
        return { ...s, dx, dy, reverseDelay }
    })
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AtomScene({
    theme,
    onToggleTheme,
    onIntroComplete,
    triggerReplay,
    onReplayDone,
}: AtomSceneProps) {
    const isDark = theme === 'dark'
    const p = pal(isDark)
    const bgColor = p.bg
    const sphereColor = isDark ? '#ffffff' : '#000000'
    const frameOffset = isDark ? 114 : 0

    const [visible, setVisible] = useState(false)
    const [phase, setPhase] = useState<Phase>('filling')
    const [animState, setAnimState] = useState<AnimState>('idle')
    const [frame, setFrame] = useState(1)
    const [showScene, setShowScene] = useState(true)
    const [isMobile, setIsMobile] = useState(false)

    const spheres = useMemo(() => generateUniverse(), [])
    const timers = useRef<ReturnType<typeof setTimeout>[]>([])
    const frameTimer = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    function clearAllTimers() {
        timers.current.forEach(clearTimeout)
        timers.current = []

        if (frameTimer.current) {
            clearInterval(frameTimer.current)
            frameTimer.current = null
        }
    }

    function startFrameAnimation() {
        setAnimState('playing')
        setShowScene(true)
        setFrame(1)

        let f = 1

        frameTimer.current = setInterval(() => {
            f++

            if (f > TOTAL_FRAMES) {
                clearInterval(frameTimer.current!)
                frameTimer.current = null
                setAnimState('finished')
                onIntroComplete?.()
                onReplayDone?.()
                setTimeout(() => setShowScene(false), 400)
                return
            }

            setFrame(f)
        }, 1000 / FPS)
    }

    function startSequence() {
        clearAllTimers()
        setPhase('filling')
        setAnimState('idle')
        setFrame(1)
        setVisible(false)
        setShowScene(true)

        const t1 = setTimeout(() => setVisible(true), 400)
        const t2 = setTimeout(() => setPhase('frozen'), 400 + FILL_DURATION + 100)
        const t3 = setTimeout(() => setPhase('reversing'), 400 + FILL_DURATION + 150)
        const t4 = setTimeout(() => {
            setPhase('done')
            startFrameAnimation()
        }, 400 + FILL_DURATION + 150 + REVERSE_DURATION + 400)

        timers.current = [t1, t2, t3, t4]
    }

    function skipToEnd() {
        clearAllTimers()
        setVisible(false)
        setPhase('done')

        if (animState === 'playing') {
            setAnimState('finished')
            onIntroComplete?.()
            onReplayDone?.()
            setTimeout(() => setShowScene(false), 400)
        } else {
            onIntroComplete?.()
            startFrameAnimation()
        }
    }

    useEffect(() => {
        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image()
            img.src = `${import.meta.env.BASE_URL}startanimation/${i + frameOffset}.png`
        }
    }, [frameOffset])

    useEffect(() => {
        startSequence()
        return () => clearAllTimers()
    }, [])

    useEffect(() => {
        if (triggerReplay) startFrameAnimation()
    }, [triggerReplay])

    useEffect(() => {
        const style = document.createElement('style')
        style.id = 'sphere-keyframes'
        style.textContent = `
            @keyframes sphereIn {
                0%   { transform: translate(-50%, -50%) scale(0); opacity: 0.3; }
                60%  { opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
            .sphere-filling {
                animation: sphereIn 0.6s cubic-bezier(0.34, 1.2, 0.64, 1) both;
            }
            .sphere-frozen {
                animation: none;
                transform: translate(-50%, -50%) scale(1);
            }
            .sphere-reversing {
                animation: none;
                transition-property: transform, opacity;
                transition-timing-function: cubic-bezier(0.4, 0, 0.8, 1);
                transition-duration: 0.8s, 0.5s;
            }
        `
        document.head.appendChild(style)

        return () => {
            document.getElementById('sphere-keyframes')?.remove()
        }
    }, [])

    if (!showScene) return null

    const frameProgress = (frame - 1) / (TOTAL_FRAMES - 1)
    const objectPosX = isMobile ? 50 + frameProgress * 50 : 50
    const frameSrc = `${import.meta.env.BASE_URL}startanimation/${frame + frameOffset}.png`

    return (
        <>
            <div
                className="fixed inset-0 overflow-hidden"
                style={{
                    background: bgColor,
                    zIndex: 10,
                    pointerEvents: 'auto',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                }}
            >
                {visible &&
                    phase !== 'done' &&
                    spheres.map((s, i) => {
                        let className = ''
                        let style: React.CSSProperties = {
                            position: 'absolute',
                            left: `${s.x}%`,
                            top: `${s.y}%`,
                            width: s.size,
                            height: s.size,
                            borderRadius: '50%',
                            background: sphereColor,
                        }

                        if (phase === 'filling') {
                            className = 'sphere-filling'
                            style = { ...style, animationDelay: `${s.delay}s` }
                        } else if (phase === 'frozen') {
                            className = 'sphere-frozen'
                        } else if (phase === 'reversing') {
                            className = 'sphere-reversing'
                            style = {
                                ...style,
                                transform: isMobile
                                    ? `translate(calc(-50% + ${s.dx * 0.6}vw), calc(-50% + ${s.dy * 0.6}vh)) scale(0)`
                                    : `translate(calc(-50% + ${s.dx}vw), calc(-50% + ${s.dy}vh)) scale(0)`,
                                opacity: 0,
                                transitionDelay: `${s.reverseDelay}s, ${s.reverseDelay + 0.2}s`,
                            }
                        }

                        return <div key={i} className={className} style={style} />
                    })}

                <AnimatePresence>
                    {animState === 'playing' && (
                        <motion.div
                            className="absolute inset-0"
                            style={{ zIndex: 40, pointerEvents: 'auto' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            onClick={onToggleTheme}
                        >
                            <img
                                src={frameSrc}
                                alt="Intro animation"
                                style={{
                                    width: '100vw',
                                    height: '100vh',
                                    objectFit: 'cover',
                                    objectPosition: `${objectPosX}% center`,
                                    userSelect: 'none',
                                    display: 'block',
                                    pointerEvents: 'none',
                                }}
                                draggable={false}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {(animState === 'idle' || animState === 'playing') && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        onClick={(e) => {
                            e.stopPropagation()
                            skipToEnd()
                        }}
                        style={{
                            position: 'fixed',
                            bottom: 36,
                            right: 36,
                            zIndex: 9999,
                            background: p.blueFaint,
                            backdropFilter: 'blur(8px)',
                            border: `1px solid ${isDark ? p.line : p.rule}`,
                            color: p.mid,
                            padding: '10px 24px',
                            borderRadius: 999,
                            fontSize: 13,
                            fontWeight: 500,
                            letterSpacing: '0.1em',
                            cursor: 'pointer',
                            fontFamily: '"DM Sans", sans-serif',
                            textTransform: 'uppercase',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            transition: 'color 0.3s ease, background 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = p.blue
                            e.currentTarget.style.background = isDark
                                ? 'rgba(96,165,250,0.12)'
                                : 'rgba(37,99,235,0.1)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = p.mid
                            e.currentTarget.style.background = p.blueFaint
                        }}
                    >
                        skip →
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    )
}