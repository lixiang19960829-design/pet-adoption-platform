'use client'

import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSyncExternalStore, useCallback } from 'react'

// Subscribe to theme changes
function subscribe(callback: () => void) {
    const handler = () => callback()
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
}

function getSnapshot() {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return stored === 'dark' || (!stored && prefersDark)
}

function getServerSnapshot() {
    return false
}

export function ThemeToggle() {
    const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

    const toggleTheme = useCallback(() => {
        const newIsDark = !isDark
        if (newIsDark) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
        // Trigger storage event for sync
        window.dispatchEvent(new Event('storage'))
    }, [isDark])

    // Apply theme class on mount
    if (typeof window !== 'undefined') {
        if (isDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                'p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-all duration-200',
                'focus-ring'
            )}
            aria-label={isDark ? '切换至亮色模式' : '切换至暗色模式'}
        >
            {isDark ? (
                <Sun className="h-5 w-5 text-[hsl(var(--foreground))]" />
            ) : (
                <Moon className="h-5 w-5 text-[hsl(var(--foreground))]" />
            )}
        </button>
    )
}
