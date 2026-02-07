'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ClipboardList, Clock, CheckCircle, XCircle, ChevronDown, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatRelativeTime, getSpeciesLabel } from '@/lib/utils'
import type { AdoptionApplication, Pet } from '@/types'

export default function ManageApplicationsPage() {
    const router = useRouter()
    const [applications, setApplications] = useState<(AdoptionApplication & { pet: Pet })[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const fetchApplications = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/?login=required')
                return
            }

            // Fetch applications for pets owned by this user
            const { data: pets } = await supabase
                .from('pets')
                .select('id')
                .eq('publisher_id', user.id)

            if (!pets || pets.length === 0) {
                setIsLoading(false)
                return
            }

            const petIds = pets.map(p => p.id)
            const { data, error } = await supabase
                .from('adoption_applications')
                .select('*, pet:pets(*)')
                .in('pet_id', petIds)
                .order('created_at', { ascending: false })

            if (!error && data) {
                setApplications(data as any)
            }
            setIsLoading(false)
        }

        fetchApplications()
    }, [router, supabase])

    const updateStatus = async (appId: string, status: 'approved' | 'rejected') => {
        const { error } = await supabase
            .from('adoption_applications')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', appId)

        if (!error) {
            setApplications(apps =>
                apps.map(app => app.id === appId ? { ...app, status } : app)
            )
        }
    }

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
                        <div key={i} className="h-32 skeleton rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white">
                    <ClipboardList className="h-5 w-5" />
                </div>
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">申请管理</h1>
            </div>

            {applications.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <ClipboardList className="h-12 w-12 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">暂无收到的申请</h3>
                        <p className="text-[hsl(var(--muted-foreground))]">
                            当有人申请领养你发布的宠物时，申请会显示在这里
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => {
                        const status = statusConfig[app.status as keyof typeof statusConfig]
                        const StatusIcon = status.icon
                        const isExpanded = expandedId === app.id

                        return (
                            <Card key={app.id}>
                                <CardContent className="p-4">
                                    {/* Header */}
                                    <div
                                        className="flex items-center gap-4 cursor-pointer"
                                        onClick={() => setExpandedId(isExpanded ? null : app.id)}
                                    >
                                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                            {app.pet?.images?.[0] ? (
                                                <img src={app.pet.images[0]} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-[hsl(var(--muted))] flex items-center justify-center">🐾</div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold">{app.applicant_name}</span>
                                                <span className="text-sm text-[hsl(var(--muted-foreground))]">申请领养</span>
                                                <Link href={`/pets/${app.pet_id}`} className="font-semibold text-[hsl(var(--primary))] hover:underline">
                                                    {app.pet?.name}
                                                </Link>
                                            </div>
                                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                                {formatRelativeTime(app.created_at)}
                                            </p>
                                        </div>

                                        <Badge variant={status.variant}>
                                            <StatusIcon className="h-3 w-3 mr-1" />
                                            {status.label}
                                        </Badge>

                                        <ChevronDown className={`h-5 w-5 text-[hsl(var(--muted-foreground))] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className="mt-4 pt-4 border-t border-[hsl(var(--border))] space-y-4 animate-fade-in">
                                            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-[hsl(var(--muted-foreground))]">邮箱：</span>
                                                    <span className="ml-2">{app.applicant_email}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[hsl(var(--muted-foreground))]">电话：</span>
                                                    <span className="ml-2">{app.applicant_phone}</span>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <span className="text-[hsl(var(--muted-foreground))]">地址：</span>
                                                    <span className="ml-2">{app.applicant_address}</span>
                                                </div>
                                                {app.housing_type && (
                                                    <div>
                                                        <span className="text-[hsl(var(--muted-foreground))]">住房类型：</span>
                                                        <span className="ml-2">{app.housing_type}</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="text-[hsl(var(--muted-foreground))]">养宠经验：</span>
                                                    <span className="ml-2">{app.has_experience ? '有' : '无'}</span>
                                                </div>
                                                {app.other_pets && (
                                                    <div className="sm:col-span-2">
                                                        <span className="text-[hsl(var(--muted-foreground))]">其他宠物：</span>
                                                        <span className="ml-2">{app.other_pets}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="bg-[hsl(var(--muted))] rounded-lg p-4">
                                                <p className="text-sm font-medium mb-2">领养理由：</p>
                                                <p className="text-sm text-[hsl(var(--muted-foreground))] whitespace-pre-line">
                                                    {app.reason}
                                                </p>
                                            </div>

                                            {app.status === 'pending' && (
                                                <div className="flex gap-3 pt-2">
                                                    <Button
                                                        onClick={() => updateStatus(app.id, 'approved')}
                                                        className="flex-1"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                        批准申请
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => updateStatus(app.id, 'rejected')}
                                                        className="flex-1"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                        拒绝申请
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
