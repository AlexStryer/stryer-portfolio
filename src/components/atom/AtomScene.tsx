import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Theme } from '../../hooks/useTheme'

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

function generateUniverse(): Sphere[] {
    const raw: { x: number; y: number; size: number; delay: number }[] = []
    raw.push({ x: 50, y: 50, size: 14, delay: 0 })

    const screenArea = window.innerWidth * window.innerHeight
    const baseArea = 1920 * 1080
    const scaleFactor = Math.max(1, screenArea / baseArea)
    const TOTAL = Math.ceil(1200 * scaleFactor)

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
        delay += (Math.random() - 0.5) * 0.3

        const x = Math.random() * 116 - 8
        const y = Math.random() * 116 - 8
        const minSize = 60 * Math.sqrt(scaleFactor)
        const maxSize = 220 * Math.sqrt(scaleFactor)
        raw.push({ x, y, size: minSize + Math.random() * (maxSize - minSize), delay })
    }

    const maxDelay = Math.max(...raw.map(s => s.delay))
    return raw.map(s => {
        const dx = 50 - s.x
        const dy = 50 - s.y
        const reverseDelay = ((maxDelay - s.delay) / maxDelay) * (maxDelay / 2)
        return { ...s, dx, dy, reverseDelay }
    })
}

type Phase = 'filling' | 'frozen' | 'reversing' | 'done'
type AnimState = 'idle' | 'playing' | 'finished'

const TOTAL_FRAMES = 112
const FPS = 30

export function AtomScene({ theme, onToggleTheme, onIntroComplete, triggerReplay, onReplayDone }: AtomSceneProps) {
    const isDark = theme === 'dark'
    const bgColor = isDark ? '#000000' : '#ffffff'
    const sphereColor = isDark ? '#ffffff' : '#000000'
    const frameOffset = isDark ? 114 : 0

    const [visible, setVisible] = useState(false)
    const [phase, setPhase] = useState<Phase>('filling')
    const [animState, setAnimState] = useState<AnimState>('idle')
    const [frame, setFrame] = useState(1)
    // showScene controls whether we render anything at all
    const [showScene, setShowScene] = useState(true)

    const spheres = useMemo(() => generateUniverse(), [])
    const timers = useRef<ReturnType<typeof setTimeout>[]>([])
    const frameTimer = useRef<ReturnType<typeof setInterval> | null>(null)

    const fillDuration = 9500
    const reverseDuration = fillDuration / 2

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
                // Hide the entire scene after a short delay
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

        const t1 = setTimeout(() => setVisible(true), 500)
        const t2 = setTimeout(() => setPhase('frozen'), 500 + fillDuration + 300)
        const t3 = setTimeout(() => setPhase('reversing'), 500 + fillDuration + 300 + 100)
        const t4 = setTimeout(() => {
            setPhase('done')
            startFrameAnimation()
        }, 500 + fillDuration + 300 + 100 + reverseDuration + 800)
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
        startSequence()
        return () => clearAllTimers()
    }, [])

    useEffect(() => {
        if (triggerReplay) {
            startFrameAnimation()
        }
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
            .sphere-filling { animation: sphereIn 0.6s cubic-bezier(0.34, 1.2, 0.64, 1) both; }
            .sphere-frozen { animation: none; transform: translate(-50%, -50%) scale(1); }
            .sphere-reversing {
                animation: none;
                transition-property: transform, opacity;
                transition-timing-function: cubic-bezier(0.4, 0, 0.8, 1);
                transition-duration: 0.8s, 0.5s;
            }
        `
        document.head.appendChild(style)
        return () => { document.getElementById('sphere-keyframes')?.remove() }
    }, [])

    if (!showScene) return null

    const frameSrc = `/startanimation/${frame + frameOffset}.png`

    return (
        <>
            <div
                className="fixed inset-0 overflow-hidden"
                style={{
                    background: animState === 'playing' ? bgColor : bgColor,
                    zIndex: 10,
                    pointerEvents: 'auto' as const,
                }}
            >
                {/* Spheres */}
                {visible && phase !== 'done' && spheres.map((s, i) => {
                    let className = ''
                    let style: React.CSSProperties = {
                        position: 'absolute',
                        left: `${s.x}%`,
                        top: `${s.y}%`,
                        width: s.size,
                        height: s.size,
                        borderRadius: '50%',
                        background: sphereColor,
                        willChange: 'transform',
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
                            transform: `translate(calc(-50% + ${s.dx}vw), calc(-50% + ${s.dy}vh)) scale(0)`,
                            opacity: 0,
                            transitionDelay: `${s.reverseDelay}s, ${s.reverseDelay + 0.2}s`,
                        }
                    }
                    return <div key={i} className={className} style={style} />
                })}

                {/* Frame animation */}
                <AnimatePresence>
                    {animState === 'playing' && (
                        <motion.div
                            className="absolute inset-0"
                            style={{ zIndex: 40, pointerEvents: 'auto' as const }}
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
                                    userSelect: 'none',
                                    display: 'block',
                                    pointerEvents: 'none' as const,
                                }}
                                draggable={false}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Skip button */}
            <AnimatePresence>
                {(animState === 'idle' || animState === 'playing') && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                        onClick={(e) => { e.stopPropagation(); skipToEnd() }}
                        style={{
                            position: 'fixed',
                            bottom: 36,
                            right: 36,
                            zIndex: 9999,
                            background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
                            backdropFilter: 'blur(8px)',
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`,
                            color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                            padding: '10px 24px',
                            borderRadius: 999,
                            fontSize: 13,
                            fontWeight: 500,
                            letterSpacing: '0.1em',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            textTransform: 'uppercase' as const,
                        }}
                    >
                        skip →
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    )
}