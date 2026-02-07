'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { Pet, ApplicationFormData } from '@/types'
import { use } from 'react'

interface PageProps {
    params: Promise<{ id: string }>
}

export default function ApplyPage({ params }: PageProps) {
    const { id } = use(params)
    const router = useRouter()
    const [pet, setPet] = useState<Pet | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formData, setFormData] = useState<ApplicationFormData>({
        applicant_name: '',
        applicant_email: '',
        applicant_phone: '',
        applicant_address: '',
        housing_type: '',
        has_experience: false,
        other_pets: '',
        reason: '',
    })

    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            // Check if user is logged in
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push(`/pets/${id}?login=required`)
                return
            }

            // Fetch pet details
            const { data: petData } = await supabase
                .from('pets')
                .select('*')
                .eq('id', id)
                .single()

            if (petData) {
                setPet(petData)
                // Pre-fill email from user
                setFormData(prev => ({
                    ...prev,
                    applicant_email: user.email || '',
                    applicant_name: user.user_metadata?.full_name || '',
                }))
            }
            setIsLoading(false)
        }

        fetchData()
    }, [id, router, supabase])

    const housingOptions = [
        { value: 'apartment', label: '公寓' },
        { value: 'house', label: '独栋房屋' },
        { value: 'townhouse', label: '联排别墅' },
        { value: 'other', label: '其他' },
    ]

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.applicant_name) newErrors.applicant_name = '请填写姓名'
        if (!formData.applicant_email) newErrors.applicant_email = '请填写邮箱'
        if (!formData.applicant_phone) newErrors.applicant_phone = '请填写电话'
        if (!formData.applicant_address) newErrors.applicant_address = '请填写地址'
        if (!formData.reason) newErrors.reason = '请填写领养理由'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setIsSubmitting(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push(`/pets/${id}?login=required`)
            return
        }

        const { error } = await supabase.from('adoption_applications').insert({
            pet_id: id,
            applicant_id: user.id,
            ...formData,
        })

        if (error) {
            console.error('Error submitting application:', error)
            alert('提交失败，请稍后重试')
            setIsSubmitting(false)
            return
        }

        router.push('/applications?success=true')
    }

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 w-48 skeleton rounded" />
                    <div className="h-64 skeleton rounded-xl" />
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 skeleton rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (!pet) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">宠物未找到</h1>
                <Link href="/" className="text-[hsl(var(--primary))]">返回首页</Link>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <Link
                href={`/pets/${id}`}
                className="inline-flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                返回宠物详情
            </Link>

            {/* Pet Summary */}
            <Card className="mb-6">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        {pet.images?.[0] ? (
                            <img src={pet.images[0]} alt={pet.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[hsl(var(--muted))] flex items-center justify-center text-3xl">🐾</div>
                        )}
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg">{pet.name}</h2>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            {pet.location}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Application Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-[hsl(var(--primary))]" />
                        领养申请表
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-[hsl(var(--foreground))]">个人信息</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Input
                                    label="姓名"
                                    id="name"
                                    value={formData.applicant_name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, applicant_name: e.target.value }))}
                                    error={errors.applicant_name}
                                    required
                                />
                                <Input
                                    label="邮箱"
                                    id="email"
                                    type="email"
                                    value={formData.applicant_email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, applicant_email: e.target.value }))}
                                    error={errors.applicant_email}
                                    required
                                />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Input
                                    label="电话"
                                    id="phone"
                                    type="tel"
                                    value={formData.applicant_phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, applicant_phone: e.target.value }))}
                                    error={errors.applicant_phone}
                                    required
                                />
                                <Select
                                    label="住房类型"
                                    id="housing"
                                    options={housingOptions}
                                    value={formData.housing_type}
                                    onChange={(e) => setFormData(prev => ({ ...prev, housing_type: e.target.value }))}
                                    placeholder="请选择"
                                />
                            </div>
                            <Input
                                label="居住地址"
                                id="address"
                                value={formData.applicant_address}
                                onChange={(e) => setFormData(prev => ({ ...prev, applicant_address: e.target.value }))}
                                error={errors.applicant_address}
                                required
                            />
                        </div>

                        {/* Pet Experience */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-[hsl(var(--foreground))]">养宠经验</h3>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="experience"
                                    checked={formData.has_experience}
                                    onChange={(e) => setFormData(prev => ({ ...prev, has_experience: e.target.checked }))}
                                    className="w-5 h-5 rounded border-[hsl(var(--input))] text-[hsl(var(--primary))]"
                                />
                                <label htmlFor="experience" className="text-sm">
                                    我有养宠物的经验
                                </label>
                            </div>
                            <Input
                                label="目前是否有其他宠物？请描述"
                                id="other-pets"
                                value={formData.other_pets}
                                onChange={(e) => setFormData(prev => ({ ...prev, other_pets: e.target.value }))}
                                placeholder="例如：有一只3岁的金毛"
                            />
                        </div>

                        {/* Reason */}
                        <Textarea
                            label="为什么想要领养这只宠物？"
                            id="reason"
                            value={formData.reason}
                            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                            error={errors.reason}
                            placeholder="请描述您的领养动机、能够提供的生活环境等..."
                            className="min-h-[120px]"
                            required
                        />

                        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
                            <Send className="h-5 w-5" />
                            提交申请
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
