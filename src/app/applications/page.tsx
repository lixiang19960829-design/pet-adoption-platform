'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatRelativeTime, getSpeciesLabel } from '@/lib/utils'
import type { AdoptionApplication, Pet } from '@/types'

export default function ApplicationsPage() {
    const router = useRouter()
    const [applications, setApplications] = useState<(AdoptionApplication & { pet: Pet })[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchApplications = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/?login=required')
                return
            }

            const { data, error } = await supabase
                .from('adoption_applications')
                .select('*, pet:pets(*)')
                .eq('applicant_id', user.id)
                .order('created_at', { ascending: false })

            if (!error && data) {
                setApplications(data as (AdoptionApplication & { pet: Pet })[])
            }
            setIsLoading(false)
        }

        fetchApplications()
    }, [router, supabase])

    const statusConfig = {
        pending: { icon: Clock, label: '待审核', variant: 'warning' as const },
        approved: { icon: CheckCircle, label: '已通过', variant: 'success' as const },
        rejected: { icon: XCircle, label: '已拒绝', variant: 'error' as const },
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
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white">
                    <FileText className="h-5 w-5" />
                </div>
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">我的申请</h1>
            </div>

            {applications.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <FileText className="h-12 w-12 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">暂无领养申请</h3>
                        <p className="text-[hsl(var(--muted-foreground))] mb-4">
                            浏览宠物列表，找到你心仪的毛孩子吧！
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
                <div className="space-y-4">
                    {applications.map((app) => {
                        const status = statusConfig[app.status as keyof typeof statusConfig]
                        const StatusIcon = status.icon

                        return (
                            <Card key={app.id} hover>
                                <Link href={`/pets/${app.pet_id}`}>
                                    <CardContent className="p-4 flex items-center gap-4">
                                        {/* Pet Image */}
                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                            {app.pet?.images?.[0] ? (
                                                <img
                                                    src={app.pet.images[0]}
                                                    alt={app.pet.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-[hsl(var(--muted))] flex items-center justify-center text-2xl">
                                                    🐾
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-[hsl(var(--foreground))] truncate">
                                                    {app.pet?.name || '未知宠物'}
                                                </h3>
                                                <Badge variant={status.variant} className="flex-shrink-0">
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {status.label}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                                {app.pet && getSpeciesLabel(app.pet.species)} · {app.pet?.location}
                                            </p>
                                            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                                                申请于 {formatRelativeTime(app.created_at)}
                                            </p>
                                        </div>

                                        {/* Arrow */}
                                        <ChevronRight className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                                    </CardContent>
                                </Link>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
