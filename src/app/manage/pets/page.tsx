'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PawPrint, Plus, Edit, Trash2, Eye, MoreVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getSpeciesLabel, getStatusLabel, formatRelativeTime } from '@/lib/utils'
import type { Pet } from '@/types'

export default function ManagePetsPage() {
    const router = useRouter()
    const [pets, setPets] = useState<Pet[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchPets = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/?login=required')
                return
            }

            const { data, error } = await supabase
                .from('pets')
                .select('*')
                .eq('publisher_id', user.id)
                .order('created_at', { ascending: false })

            if (!error && data) {
                setPets(data)
            }
            setIsLoading(false)
        }

        fetchPets()
    }, [router, supabase])

    const deletePet = async (petId: string) => {
        if (!confirm('确定要删除这只宠物吗？此操作无法撤销。')) return

        const { error } = await supabase.from('pets').delete().eq('id', petId)
        if (!error) {
            setPets(pets.filter(p => p.id !== petId))
        }
    }

    const statusVariant = {
        available: 'success' as const,
        pending: 'warning' as const,
        adopted: 'default' as const,
    }

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 w-48 skeleton rounded" />
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 skeleton rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white">
                        <PawPrint className="h-5 w-5" />
                    </div>
                    <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">我的宠物</h1>
                </div>
                <Link
                    href="/publish"
                    className="inline-flex items-center justify-center font-medium transition-all duration-200 focus-ring rounded-lg text-sm px-4 py-2.5 gap-2 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white hover:opacity-90 shadow-md hover:shadow-lg"
                >
                    <Plus className="h-4 w-4" />
                    发布宠物
                </Link>
            </div>

            {pets.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <PawPrint className="h-12 w-12 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">还没有发布宠物</h3>
                        <p className="text-[hsl(var(--muted-foreground))] mb-4">
                            发布待领养的宠物，帮助它们找到新家
                        </p>
                        <Link
                            href="/publish"
                            className="inline-flex items-center justify-center font-medium transition-all duration-200 focus-ring rounded-lg text-sm px-4 py-2.5 gap-2 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white hover:opacity-90 shadow-md hover:shadow-lg"
                        >
                            <Plus className="h-4 w-4" />
                            发布宠物
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {pets.map((pet) => (
                        <Card key={pet.id}>
                            <CardContent className="p-4 flex items-center gap-4">
                                {/* Pet Image */}
                                <Link href={`/pets/${pet.id}`} className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                    {pet.images?.[0] ? (
                                        <img
                                            src={pet.images[0]}
                                            alt={pet.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[hsl(var(--muted))] flex items-center justify-center text-3xl">
                                            🐾
                                        </div>
                                    )}
                                </Link>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Link href={`/pets/${pet.id}`} className="font-semibold text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] truncate transition-colors">
                                            {pet.name}
                                        </Link>
                                        <Badge variant={statusVariant[pet.status as keyof typeof statusVariant]}>
                                            {getStatusLabel(pet.status)}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                        {getSpeciesLabel(pet.species)} · {pet.location}
                                    </p>
                                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                                        发布于 {formatRelativeTime(pet.created_at)}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/pets/${pet.id}`}
                                        className="inline-flex items-center justify-center font-medium transition-all duration-200 focus-ring rounded-lg text-sm px-3 py-1.5 gap-1.5 text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href={`/manage/applications?pet=${pet.id}`}
                                        className="inline-flex items-center justify-center font-medium transition-all duration-200 focus-ring rounded-lg text-sm px-3 py-1.5 gap-1.5 text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deletePet(pet.id)}
                                        className="text-[hsl(var(--error))] hover:text-[hsl(var(--error))] hover:bg-[hsl(var(--error)/0.1)]"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
