'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

// Client-side only check using useSyncExternalStore
function useIsClient() {
    return useSyncExternalStore(
        () => () => { },
        () => true,
        () => false
    )
}

export function ThemeToggle() {
    const isClient = useIsClient()
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        if (!isClient) return

        const stored = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        if (stored === 'dark' || (!stored && prefersDark)) {
            setIsDark(true)
            document.documentElement.classList.add('dark')
        }
    }, [isClient])

    const toggleTheme = () => {
        const newIsDark = !isDark
        setIsDark(newIsDark)
        if (newIsDark) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }

    if (!isClient) {
        return (
            <button className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors">
                <div className="h-5 w-5" />
            </button>
        )
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
