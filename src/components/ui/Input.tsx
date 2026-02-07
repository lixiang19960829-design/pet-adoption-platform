'use client'

import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    startIcon?: ReactNode
    endIcon?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, startIcon, endIcon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {startIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] pointer-events-none">
                            {startIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={id}
                        className={cn(
                            'flex h-10 w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] py-2 text-sm',
                            'placeholder:text-[hsl(var(--muted-foreground))]',
                            'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2 focus:ring-offset-[hsl(var(--background))]',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            'transition-all duration-200',
                            startIcon ? 'pl-10' : 'pl-3',
                            endIcon ? 'pr-10' : 'pr-3',
                            error && 'border-[hsl(var(--error))] focus:ring-[hsl(var(--error))]',
                            className
                        )}
                        {...props}
                    />
                    {endIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] pointer-events-none">
                            {endIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1 text-sm text-[hsl(var(--error))]">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input }
