export function SplitSlider({ isDark }: { isDark: boolean }) {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDark ? '#ffffff' : '#000000',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 11,
            letterSpacing: '0.2em',
            opacity: 0.3,
        }}>
            SPLIT SLIDER — COMING SOON
        </div>
    )
}