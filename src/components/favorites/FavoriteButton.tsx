'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
    petId: string
    size?: 'sm' | 'md'
}

export function FavoriteButton({ petId, size = 'sm' }: FavoriteButtonProps) {
    const [isFavorited, setIsFavorited] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const checkFavorite = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            setIsLoggedIn(true)

            const { data } = await supabase
                .from('favorites')
                .select('id')
                .eq('user_id', user.id)
                .eq('pet_id', petId)
                .single()

            setIsFavorited(!!data)
        }

        checkFavorite()
    }, [petId, supabase])

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isLoggedIn) {
            // Could show login modal here
            alert('请先登录后再收藏')
            return
        }

        setIsLoading(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            setIsLoading(false)
            return
        }

        if (isFavorited) {
            await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('pet_id', petId)
            setIsFavorited(false)
        } else {
            await supabase
                .from('favorites')
                .insert({ user_id: user.id, pet_id: petId })
            setIsFavorited(true)
        }

        setIsLoading(false)
    }

    const sizeClasses = {
        sm: 'p-2',
        md: 'p-3',
    }

    const iconSizes = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
    }

    return (
        <button
            onClick={toggleFavorite}
            disabled={isLoading}
            className={cn(
                'rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-sm shadow-sm',
                'hover:scale-110 transition-all duration-200',
                'focus-ring',
                sizeClasses[size],
                isLoading && 'opacity-50 cursor-not-allowed'
            )}
            aria-label={isFavorited ? '取消收藏' : '添加收藏'}
        >
            <Heart
                className={cn(
                    iconSizes[size],
                    'transition-colors',
                    isFavorited
                        ? 'fill-[hsl(var(--error))] text-[hsl(var(--error))]'
                        : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--error))]'
                )}
            />
        </button>
    )
}
