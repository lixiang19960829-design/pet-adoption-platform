'use client'

import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, id, ...props }, ref) => {
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
                <textarea
                    ref={ref}
                    id={id}
                    className={cn(
                        'flex min-h-[100px] w-full rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm',
                        'placeholder:text-[hsl(var(--muted-foreground))]',
                        'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2 focus:ring-offset-[hsl(var(--background))]',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'transition-all duration-200 resize-none',
                        error && 'border-[hsl(var(--error))] focus:ring-[hsl(var(--error))]',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-[hsl(var(--error))]">{error}</p>
                )}
            </div>
        )
    }
)

Textarea.displayName = 'Textarea'

export { Textarea }
