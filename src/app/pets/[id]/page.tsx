import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Heart, Share2, MessageCircle, Check, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ImageCarousel } from '@/components/pets/ImageCarousel'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { getSpeciesLabel, getGenderLabel, getSizeLabel, getStatusLabel, formatDate } from '@/lib/utils'
import type { Pet } from '@/types'
import type { Metadata } from 'next'

interface PageProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params
    const supabase = await createClient()
    const { data: pet } = await supabase
        .from('pets')
        .select('name, species, description')
        .eq('id', id)
        .single()

    if (!pet) {
        return { title: '宠物未找到 - 萌宠之家' }
    }

    return {
        title: `${pet.name} - ${getSpeciesLabel(pet.species)}领养 | 萌宠之家`,
        description: pet.description || `领养${getSpeciesLabel(pet.species)} ${pet.name}`,
    }
}

export default async function PetDetailPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: pet, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !pet) {
        notFound()
    }

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

    const infoItems = [
        { label: '种类', value: getSpeciesLabel(pet.species) },
        { label: '品种', value: pet.breed || '未知' },
        { label: '性别', value: getGenderLabel(pet.gender) },
        { label: '年龄', value: ageDisplay() },
        { label: '体型', value: pet.size ? getSizeLabel(pet.size) : '未知' },
        { label: '毛色', value: pet.color || '未知' },
    ]

    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    返回首页
                </Link>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Images */}
                    <div className="animate-fade-in">
                        <ImageCarousel images={pet.images || []} alt={pet.name} />
                    </div>

                    {/* Right Column - Info */}
                    <div className="animate-slide-in-right space-y-6">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <Badge variant={statusVariant[pet.status as keyof typeof statusVariant]} className="mb-2">
                                    {getStatusLabel(pet.status)}
                                </Badge>
                                <h1 className="text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))]">
                                    {pet.name}
                                </h1>
                                <div className="flex items-center gap-2 mt-2 text-[hsl(var(--muted-foreground))]">
                                    <MapPin className="h-4 w-4" />
                                    <span>{pet.location}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FavoriteButton petId={pet.id} size="md" />
                                <button className="p-3 rounded-full bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted-foreground)/0.2)] transition-colors">
                                    <Share2 className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                                </button>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="font-semibold text-lg mb-4">基本信息</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {infoItems.map((item) => (
                                        <div key={item.label}>
                                            <div className="text-sm text-[hsl(var(--muted-foreground))]">{item.label}</div>
                                            <div className="font-medium">{item.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        {pet.description && (
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="font-semibold text-lg mb-3">关于 {pet.name}</h2>
                                    <p className="text-[hsl(var(--muted-foreground))] leading-relaxed whitespace-pre-line">
                                        {pet.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Health Status */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="font-semibold text-lg mb-4">健康状况</h2>
                                <div className="space-y-3">
                                    {pet.health_status && (
                                        <div className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-[hsl(var(--success))] mt-0.5" />
                                            <span>{pet.health_status}</span>
                                        </div>
                                    )}
                                    {pet.vaccination_status && (
                                        <div className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-[hsl(var(--success))] mt-0.5" />
                                            <span>{pet.vaccination_status}</span>
                                        </div>
                                    )}
                                    {!pet.health_status && !pet.vaccination_status && (
                                        <p className="text-[hsl(var(--muted-foreground))]">暂无健康信息</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Adoption Requirements */}
                        {pet.adoption_requirements && (
                            <Card>
                                <CardContent className="p-6">
                                    <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-[hsl(var(--warning))]" />
                                        领养须知
                                    </h2>
                                    <p className="text-[hsl(var(--muted-foreground))] leading-relaxed whitespace-pre-line">
                                        {pet.adoption_requirements}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Action Buttons */}
                        {pet.status === 'available' && (
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Link
                                    href={`/pets/${pet.id}/apply`}
                                    className="inline-flex items-center justify-center font-medium transition-all duration-200 focus-ring rounded-lg text-base px-6 py-3 gap-2 flex-1 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white hover:opacity-90 shadow-md hover:shadow-lg"
                                >
                                    <Heart className="h-5 w-5" />
                                    申请领养
                                </Link>
                                <Button variant="outline" size="lg" className="flex-1">
                                    <MessageCircle className="h-5 w-5" />
                                    联系发布者
                                </Button>
                            </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                            <Calendar className="h-4 w-4" />
                            <span>发布于 {formatDate(pet.created_at)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
