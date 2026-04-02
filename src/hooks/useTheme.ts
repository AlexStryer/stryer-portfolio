import { useState, useEffect, useCallback } from 'react'

export type Theme = 'dark' | 'light'

export function useTheme(): { theme: Theme; toggleTheme: () => void } {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === 'undefined') return 'light'
        const stored = localStorage.getItem('theme') as Theme | null
        if (stored) return stored
        return 'light'
    })

    useEffect(() => {
        const root = document.documentElement
        if (theme === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = useCallback(() => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
    }, [])

    return { theme, toggleTheme }
}