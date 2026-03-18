import { useEffect, useRef, useState } from 'react'

interface DeepSpaceProps {
    isDark: boolean
}

const FONT: Record<string, number[][]> = {
    A: [[0, 1, 1, 0], [1, 0, 0, 1], [1, 1, 1, 1], [1, 0, 0, 1], [1, 0, 0, 1]],
    B: [[1, 1, 1, 0], [1, 0, 0, 1], [1, 1, 1, 0], [1, 0, 0, 1], [1, 1, 1, 0]],
    C: [[0, 1, 1, 1], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [0, 1, 1, 1]],
    D: [[1, 1, 1, 0], [1, 0, 0, 1], [1, 0, 0, 1], [1, 0, 0, 1], [1, 1, 1, 0]],
    E: [[1, 1, 1, 1], [1, 0, 0, 0], [1, 1, 1, 0], [1, 0, 0, 0], [1, 1, 1, 1]],
    F: [[1, 1, 1, 1], [1, 0, 0, 0], [1, 1, 1, 0], [1, 0, 0, 0], [1, 0, 0, 0]],
    G: [[0, 1, 1, 1], [1, 0, 0, 0], [1, 0, 1, 1], [1, 0, 0, 1], [0, 1, 1, 1]],
    H: [[1, 0, 0, 1], [1, 0, 0, 1], [1, 1, 1, 1], [1, 0, 0, 1], [1, 0, 0, 1]],
    I: [[1, 1, 1], [0, 1, 0], [0, 1, 0], [0, 1, 0], [1, 1, 1]],
    J: [[0, 0, 1], [0, 0, 1], [0, 0, 1], [1, 0, 1], [0, 1, 1]],
    K: [[1, 0, 0, 1], [1, 0, 1, 0], [1, 1, 0, 0], [1, 0, 1, 0], [1, 0, 0, 1]],
    L: [[1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 1, 1, 1]],
    M: [[1, 0, 0, 0, 1], [1, 1, 0, 1, 1], [1, 0, 1, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1]],
    N: [[1, 0, 0, 1], [1, 1, 0, 1], [1, 0, 1, 1], [1, 0, 0, 1], [1, 0, 0, 1]],
    O: [[0, 1, 1, 0], [1, 0, 0, 1], [1, 0, 0, 1], [1, 0, 0, 1], [0, 1, 1, 0]],
    P: [[1, 1, 1, 0], [1, 0, 0, 1], [1, 1, 1, 0], [1, 0, 0, 0], [1, 0, 0, 0]],
    R: [[1, 1, 1, 0], [1, 0, 0, 1], [1, 1, 1, 0], [1, 0, 1, 0], [1, 0, 0, 1]],
    S: [[0, 1, 1, 1], [1, 0, 0, 0], [0, 1, 1, 0], [0, 0, 0, 1], [1, 1, 1, 0]],
    T: [[1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]],
    U: [[1, 0, 0, 1], [1, 0, 0, 1], [1, 0, 0, 1], [1, 0, 0, 1], [0, 1, 1, 0]],
    V: [[1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 0, 1, 0], [0, 1, 0, 1, 0], [0, 0, 1, 0, 0]],
    W: [[1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 1, 0, 1], [1, 1, 0, 1, 1], [1, 0, 0, 0, 1]],
    X: [[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 1, 0], [1, 0, 0, 1], [1, 0, 0, 1]],
    Y: [[1, 0, 0, 0, 1], [0, 1, 0, 1, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]],
    Z: [[1, 1, 1, 1], [0, 0, 1, 0], [0, 1, 0, 0], [1, 0, 0, 0], [1, 1, 1, 1]],
    ' ': [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
}

const WORDS = [
    'ALEXANDRO',
    'STRYER',
    'ENGINEER',
    'BUILDER',
    'CREATOR',
    'REACT',
    'SWIFT',
    'MUSIC',
    'DJ',
    'EVENTS',
    'DRIVEN',
]

const DOT_GAP = 28
const DOT_RADIUS = 1.5
const ACTIVE_RADIUS = 4
const LETTER_GAP = 7
const LETTER_SPACING = 2
const EASE = 0.075

interface Dot {
    restX: number
    restY: number
    targetX: number
    targetY: number
    x: number
    y: number
    active: boolean
}

function buildWordTargets(word: string, W: number, H: number): { x: number; y: number }[] {
    const letters = word.split('').map(c => FONT[c] ?? FONT['A'])
    const cols = letters.reduce((sum, l) => sum + (l[0]?.length ?? 0) + LETTER_SPACING, -LETTER_SPACING)
    const totalW = cols * (ACTIVE_RADIUS * 2 + LETTER_GAP)
    const totalH = 5 * (ACTIVE_RADIUS * 2 + LETTER_GAP)
    const ox = W / 2 - totalW / 2
    const oy = H / 2 - totalH / 2

    const result: { x: number; y: number }[] = []
    let cx = 0
    for (const grid of letters) {
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < (grid[row]?.length ?? 0); col++) {
                if (grid[row][col]) {
                    result.push({
                        x: ox + (cx + col) * (ACTIVE_RADIUS * 2 + LETTER_GAP) + ACTIVE_RADIUS,
                        y: oy + row * (ACTIVE_RADIUS * 2 + LETTER_GAP) + ACTIVE_RADIUS,
                    })
                }
            }
        }
        cx += (grid[0]?.length ?? 0) + LETTER_SPACING
    }
    return result
}

export function DeepSpace({ isDark }: DeepSpaceProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const dotsRef = useRef<Dot[]>([])
    const animRef = useRef<number | null>(null)
    const currentWordRef = useRef(-1)
    const sizeRef = useRef({ W: 0, H: 0 })
    const [displayWord, setDisplayWord] = useState('')
    const [wordIdx, setWordIdx] = useState(-1)

    const dotColor = isDark ? '255,255,255' : '0,0,0'

    // Init canvas + dots
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const W = window.innerWidth
        const H = window.innerHeight
        canvas.width = W
        canvas.height = H
        sizeRef.current = { W, H }

        const cols = Math.ceil(W / DOT_GAP) + 1
        const rows = Math.ceil(H / DOT_GAP) + 1
        const dots: Dot[] = []

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = c * DOT_GAP + DOT_GAP / 2
                const y = r * DOT_GAP + DOT_GAP / 2
                dots.push({ restX: x, restY: y, targetX: x, targetY: y, x, y, active: false })
            }
        }
        dotsRef.current = dots
    }, [])

    // Morph to word
    const morphTo = (word: string) => {
        const { W, H } = sizeRef.current
        const targets = buildWordTargets(word, W, H)
        const dots = dotsRef.current

        dots.forEach(d => { d.active = false; d.targetX = d.restX; d.targetY = d.restY })

        const pool = [...dots].sort(() => Math.random() - 0.5)
        targets.forEach((t, i) => {
            if (pool[i]) {
                pool[i].active = true
                pool[i].targetX = t.x
                pool[i].targetY = t.y
            }
        })
    }

    const dissolveAll = () => {
        dotsRef.current.forEach(d => {
            d.active = false
            d.targetX = d.restX
            d.targetY = d.restY
        })
    }

    // Draw loop
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')!

        const tick = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            dotsRef.current.forEach(dot => {
                dot.x += (dot.targetX - dot.x) * EASE
                dot.y += (dot.targetY - dot.y) * EASE
                const r = dot.active ? ACTIVE_RADIUS : DOT_RADIUS
                const alpha = dot.active ? 0.9 : 0.13
                ctx.beginPath()
                ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(${dotColor}, ${alpha})`
                ctx.fill()
            })
            animRef.current = requestAnimationFrame(tick)
        }
        animRef.current = requestAnimationFrame(tick)
        return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
    }, [dotColor])

    // Scroll detection — use IntersectionObserver + scroll event on window
    useEffect(() => {
        const updateFromScroll = () => {
            const container = containerRef.current
            if (!container) return

            const rect = container.getBoundingClientRect()
            const totalScrollable = container.offsetHeight - window.innerHeight
            const scrolled = -rect.top
            const progress = Math.max(0, Math.min(1, scrolled / totalScrollable))

            if (scrolled < 0) {
                // Not yet scrolled into section
                if (currentWordRef.current !== -1) {
                    currentWordRef.current = -1
                    dissolveAll()
                    setDisplayWord('')
                    setWordIdx(-1)
                }
                return
            }

            const idx = Math.min(WORDS.length - 1, Math.floor(progress * WORDS.length))

            if (idx !== currentWordRef.current) {
                currentWordRef.current = idx
                morphTo(WORDS[idx])
                setDisplayWord(WORDS[idx])
                setWordIdx(idx)
            }
        }

        window.addEventListener('scroll', updateFromScroll, { passive: true })
        // Also call once in case already scrolled
        updateFromScroll()
        return () => window.removeEventListener('scroll', updateFromScroll)
    }, [])

    return (
        <div
            ref={containerRef}
            style={{ height: `${(WORDS.length + 2) * 100}vh`, position: 'relative' as const }}
        >
            <div style={{
                position: 'sticky' as const,
                top: 0,
                height: '100vh',
                overflow: 'hidden' as const,
            }}>
                <canvas
                    ref={canvasRef}
                    style={{ position: 'absolute' as const, inset: 0 }}
                />

                {/* Vignette */}
                <div style={{
                    position: 'absolute' as const,
                    inset: 0,
                    background: isDark
                        ? 'radial-gradient(ellipse 65% 65% at 50% 50%, transparent 15%, rgba(0,0,0,0.65) 100%)'
                        : 'radial-gradient(ellipse 65% 65% at 50% 50%, transparent 15%, rgba(255,255,255,0.75) 100%)',
                    pointerEvents: 'none' as const,
                }} />

                {/* Top left */}
                <div style={{
                    position: 'absolute' as const,
                    top: 40,
                    left: 48,
                    zIndex: 10,
                    fontFamily: '"DM Sans", sans-serif',
                }}>
                    <p style={{
                        fontSize: 9,
                        letterSpacing: '0.28em',
                        textTransform: 'uppercase' as const,
                        color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                        margin: 0,
                    }}>
                        About · Depth & Perception
                    </p>
                    <p style={{
                        fontSize: 9,
                        letterSpacing: '0.2em',
                        color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        margin: '4px 0 0',
                        textTransform: 'uppercase' as const,
                    }}>
                        {wordIdx >= 0 ? displayWord : 'Scroll to reveal'}
                    </p>
                </div>

                {/* Counter */}
                {wordIdx >= 0 && (
                    <div style={{
                        position: 'absolute' as const,
                        top: 40,
                        right: 48,
                        zIndex: 10,
                        fontSize: 9,
                        letterSpacing: '0.2em',
                        color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                        fontFamily: '"DM Sans", sans-serif',
                        textTransform: 'uppercase' as const,
                    }}>
                        {String(wordIdx + 1).padStart(2, '0')} / {String(WORDS.length).padStart(2, '0')}
                    </div>
                )}

                {/* Progress bar */}
                <div style={{
                    position: 'absolute' as const,
                    bottom: 48,
                    left: 48,
                    right: 48,
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                }}>
                    <div style={{
                        flex: 1,
                        height: 1,
                        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                        position: 'relative' as const,
                    }}>
                        <div style={{
                            position: 'absolute' as const,
                            left: 0, top: 0, bottom: 0,
                            width: `${wordIdx < 0 ? 0 : ((wordIdx + 1) / WORDS.length) * 100}%`,
                            background: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
                            transition: 'width 0.5s ease',
                        }} />
                    </div>
                    <span style={{
                        fontSize: 9,
                        letterSpacing: '0.2em',
                        color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                        fontFamily: '"DM Sans", sans-serif',
                        textTransform: 'uppercase' as const,
                    }}>
                        Scroll ↓
                    </span>
                </div>
            </div>
        </div>
    )
}