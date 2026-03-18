import type { Theme } from '../../hooks/useTheme'
import { DeepSpace } from './DeepSpace'
import { SplitSlider } from './SplitSlider.tsx'
import { GravityWell } from './GravityWell'

interface AboutProps {
    theme: Theme
}

function DotGrid({ isDark }: { isDark: boolean }) {
    const dotColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
    return (
        <div style={{
            position: 'absolute' as const,
            inset: 0,
            zIndex: 0,
            backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
            pointerEvents: 'none' as const,
        }} />
    )
}

export default function About({ theme }: AboutProps) {
    const isDark = theme === 'dark'

    return (
        <section
            id="about"
            style={{
                position: 'relative' as const,
                color: isDark ? '#ffffff' : '#000000',
                fontFamily: '"DM Sans", sans-serif',
            }}
        >
            <DotGrid isDark={isDark} />
            <div style={{ position: 'relative' as const, zIndex: 1 }}>
                <DeepSpace isDark={isDark} />
                <SplitSlider isDark={isDark} />
                <GravityWell isDark={isDark} />
            </div>
        </section>
    )
}