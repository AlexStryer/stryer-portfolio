// ── Shared color palette ──────────────────────────────────────────────────────
// Single source of truth for all colors across the site.
// Import in any component: import { pal } from '../utils/palette'
//
// Usage:
//   const p = pal(isDark)
//   <div style={{ background: p.bg, color: p.fg }}>

export type Theme = 'light' | 'dark'

export function pal(isDark: boolean) {
    return {
        // ── Base ──────────────────────────────────────────────
        bg: isDark ? '#0a0a0c' : '#ffffff',
        fg: isDark ? '#f0f0f0' : '#0a0a0a',
        mid: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)',
        muted: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.2)',
        subtle: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
        rule: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
        line: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',

        // ── Blue accent ──────────────────────────────────────
        blue: isDark ? '#60a5fa' : '#2563eb',
        blueMid: isDark ? 'rgba(96,165,250,0.4)' : 'rgba(37,99,235,0.35)',
        blueGlow: isDark ? 'rgba(96,165,250,0.2)' : 'rgba(37,99,235,0.12)',
        blueFaint: isDark ? 'rgba(96,165,250,0.07)' : 'rgba(37,99,235,0.05)',

        // ── Grid (used by Contact + Engineer panel) ──────────
        grid: isDark ? 'rgba(96,165,250,0.03)' : 'rgba(37,99,235,0.02)',

        // ── Navbar / floating UI ─────────────────────────────
        pill: isDark ? 'rgba(12, 12, 12, 0.82)' : 'rgba(255, 255, 255, 0.82)',
        pillBd: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
        overlay: isDark ? 'rgba(0, 0, 0, 0.94)' : 'rgba(255, 255, 255, 0.96)',
        toggleBg: isDark ? 'rgba(96,165,250,0.1)' : 'rgba(37,99,235,0.06)',
        toggleBd: isDark ? 'rgba(96,165,250,0.2)' : 'rgba(37,99,235,0.15)',

        // ── Footer (slightly different bg for separation) ────
        footerBg: isDark ? '#060608' : '#fafafa',

        // ── About: Engineer panel ────────────────────────────
        eng: {
            bg: isDark ? '#0a0a0c' : '#ffffff',
            h: isDark ? 'rgba(220,225,240,0.95)' : 'rgba(10,15,30,0.92)',
            p: isDark ? 'rgba(200,210,230,0.58)' : 'rgba(15,23,42,0.5)',
            dim: isDark ? 'rgba(200,210,230,0.28)' : 'rgba(15,23,42,0.22)',
            label: isDark ? 'rgba(96,165,250,0.7)' : 'rgba(37,99,235,0.7)',
            grid: isDark ? 'rgba(96,165,250,0.03)' : 'rgba(37,99,235,0.02)',
            tagC: isDark ? 'rgba(96,165,250,0.75)' : 'rgba(37,99,235,0.7)',
            tagBg: isDark ? 'rgba(96,165,250,0.07)' : 'rgba(37,99,235,0.06)',
            tagBd: isDark ? 'rgba(96,165,250,0.12)' : 'rgba(37,99,235,0.1)',
            line: isDark ? 'rgba(96,165,250,0.06)' : 'rgba(37,99,235,0.05)',
            dimTag: isDark ? 'rgba(200,210,230,0.3)' : 'rgba(15,23,42,0.25)',
            dimTagBd: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        },

        // ── About: Entrepreneur panel ────────────────────────
        ent: {
            bg: isDark ? '#08080c' : '#f5f5f7',
            h: isDark ? 'rgba(215,215,230,0.95)' : 'rgba(15,15,25,0.92)',
            p: isDark ? 'rgba(210,210,225,0.55)' : 'rgba(20,20,30,0.48)',
            dim: isDark ? 'rgba(210,210,225,0.24)' : 'rgba(20,20,30,0.18)',
            label: isDark ? 'rgba(210,210,225,0.28)' : 'rgba(20,20,30,0.22)',
            bd: isDark ? 'rgba(210,210,225,0.07)' : 'rgba(20,20,30,0.06)',
        },
    }
}