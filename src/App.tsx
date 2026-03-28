import { useState } from 'react'
import { AtomScene } from './components/atom/AtomScene'
import { useTheme } from './hooks/useTheme'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Contact from './sections/Contact'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [introComplete, setIntroComplete] = useState(false)
  const [replayAnimation, setReplayAnimation] = useState(false)

  const isDark = theme === 'dark'

  return (
    <div style={{
      backgroundColor: isDark ? '#000000' : '#ffffff',
      minHeight: '100vh',
    }}>
      <AtomScene
        theme={theme}
        onToggleTheme={toggleTheme}
        onIntroComplete={() => setIntroComplete(true)}
        triggerReplay={replayAnimation}
        onReplayDone={() => setReplayAnimation(false)}
      />

      {introComplete && (
        <main
          style={{
            position: 'relative',
            zIndex: 1,
            backgroundColor: isDark ? '#000000' : '#ffffff',
            transition: 'background-color 700ms cubic-bezier(0.4, 0, 0.2, 1)',
            color: isDark ? '#ffffff' : '#000000',
          }}
        >
          <Hero
            theme={theme}
            onToggleTheme={toggleTheme}
            onRocketClick={() => setReplayAnimation(true)}
          />
          <About theme={theme} />
          <Projects theme={theme} />
          <Contact />
        </main>
      )}
    </div>
  )
}