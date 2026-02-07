import { cn } from '@/lib/utils'

interface BadgeProps {
    children: React.ReactNode
    variant?: 'default' | 'success' | 'warning' | 'error'
    className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
    const variants = {
        default: 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
        success: 'bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]',
        warning: 'bg-[hsl(var(--warning)/0.1)] text-[hsl(var(--warning))]',
        error: 'bg-[hsl(var(--error)/0.1)] text-[hsl(var(--error))]',
    }

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    )
}
