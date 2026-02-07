'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PetCard } from '@/components/pets/PetCard'
import { Card, CardContent } from '@/components/ui/Card'
import type { Favorite, Pet } from '@/types'

export default function FavoritesPage() {
    const router = useRouter()
    const [favorites, setFavorites] = useState<(Favorite & { pet: Pet })[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchFavorites = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/?login=required')
                return
            }

            const { data, error } = await supabase
                .from('favorites')
                .select('*, pet:pets(*)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (!error && data) {
                setFavorites(data as any)
            }
            setIsLoading(false)
        }

        fetchFavorites()
    }, [router, supabase])

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 w-48 skeleton rounded" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-xl overflow-hidden">
                                <div className="aspect-[4/3] skeleton" />
                                <div className="p-4 space-y-3">
                                    <div className="h-5 skeleton rounded w-2/3" />
                                    <div className="h-4 skeleton rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white">
                    <Heart className="h-5 w-5" />
                </div>
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">我的收藏</h1>
            </div>

            {favorites.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Heart className="h-12 w-12 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">暂无收藏</h3>
                        <p className="text-[hsl(var(--muted-foreground))] mb-4">
                            浏览宠物列表，收藏你喜欢的毛孩子
                        </p>
                        <Link
                            href="/"
                            className="text-[hsl(var(--primary))] hover:underline"
                        >
                            浏览宠物
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favorites.map((fav) => fav.pet && (
                        <PetCard key={fav.id} pet={fav.pet} />
                    ))}
                </div>
            )}
        </div>
    )
}
