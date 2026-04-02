import { useState } from 'react'
import { AtomScene } from './components/atom/AtomScene'
import { useTheme } from './hooks/useTheme'
import { pal } from './utils/palette'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Contact from './sections/Contact'

/**
 * Root application component.
 *
 * Manages global state: theme (light/dark), intro animation lifecycle,
 * and rocket replay trigger. Renders the intro scene first, then reveals
 * the main site content once the intro completes.
 */
export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [introComplete, setIntroComplete] = useState(false)
  const [replayAnimation, setReplayAnimation] = useState(false)

  const isDark = theme === 'dark'
  const p = pal(isDark)

  return (
    <div style={{
      backgroundColor: p.bg,
      minHeight: '100vh',
    }}>
      {/* 3D atom intro — plays once on load, can be replayed via rocket click */}
      <AtomScene
        theme={theme}
        onToggleTheme={toggleTheme}
        onIntroComplete={() => setIntroComplete(true)}
        triggerReplay={replayAnimation}
        onReplayDone={() => setReplayAnimation(false)}
      />

      {/* Main site — revealed after intro animation finishes */}
      {introComplete && (
        <>
          <Navbar theme={theme} onToggleTheme={toggleTheme} />

          <main
            style={{
              position: 'relative',
              zIndex: 1,
              backgroundColor: p.bg,
              transition: 'background-color 700ms cubic-bezier(0.4, 0, 0.2, 1)',
              color: p.fg,
            }}
          >
            <Hero
              theme={theme}
              onRocketClick={() => setReplayAnimation(true)}
            />
            <About theme={theme} />
            <Projects theme={theme} />
            <Contact theme={theme} />
          </main>

          <Footer theme={theme} />
        </>
      )}
    </div>
  )
}