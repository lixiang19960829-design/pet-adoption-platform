'use client'

import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'
import { getSpeciesLabel, getGenderLabel, getSizeLabel, getStatusLabel } from '@/lib/utils'
import type { Pet } from '@/types'

interface PetCardProps {
    pet: Pet
    showFavorite?: boolean
}

export function PetCard({ pet, showFavorite = true }: PetCardProps) {
    const statusVariant = {
        available: 'success' as const,
        pending: 'warning' as const,
        adopted: 'default' as const,
    }

    const ageDisplay = () => {
        if (pet.age_years && pet.age_months) {
            return `${pet.age_years}岁${pet.age_months}个月`
        }
        if (pet.age_years) {
            return `${pet.age_years}岁`
        }
        if (pet.age_months) {
            return `${pet.age_months}个月`
        }
        return '年龄未知'
    }

    return (
        <Card hover className="overflow-hidden group animate-fade-up">
            <Link href={`/pets/${pet.id}`}>
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    {pet.images && pet.images.length > 0 ? (
                        <img
                            src={pet.images[0]}
                            alt={pet.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--primary)/0.2)] to-[hsl(var(--secondary)/0.2)] flex items-center justify-center">
                            <span className="text-6xl">🐾</span>
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                        <Badge variant={statusVariant[pet.status]}>
                            {getStatusLabel(pet.status)}
                        </Badge>
                    </div>

                    {/* Favorite Button */}
                    {showFavorite && (
                        <div className="absolute top-3 right-3">
                            <FavoriteButton petId={pet.id} />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                            {pet.name}
                        </h3>
                        <span className="text-sm text-[hsl(var(--muted-foreground))]">
                            {getSpeciesLabel(pet.species)}
                        </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="px-2 py-0.5 text-xs rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                            {getGenderLabel(pet.gender)}
                        </span>
                        {pet.size && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                                {getSizeLabel(pet.size)}
                            </span>
                        )}
                        <span className="px-2 py-0.5 text-xs rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                            {ageDisplay()}
                        </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))]">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{pet.location}</span>
                    </div>
                </div>
            </Link>
        </Card>
    )
}
