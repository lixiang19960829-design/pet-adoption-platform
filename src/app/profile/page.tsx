'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { UserProfile } from '@/types'

export default function ProfilePage() {
    const router = useRouter()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        address: '',
    })
    const supabase = createClient()

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/?login=required')
                return
            }

            setEmail(user.email || '')

            const { data } = await supabase
                .from('users_profile')
                .select('*')
                .eq('id', user.id)
                .single()

            if (data) {
                setProfile(data)
                setFormData({
                    full_name: data.full_name || '',
                    phone: data.phone || '',
                    address: data.address || '',
                })
            }
            setIsLoading(false)
        }

        fetchProfile()
    }, [router, supabase])

    const handleSave = async () => {
        setIsSaving(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('users_profile')
            .upsert({
                id: user.id,
                ...formData,
                updated_at: new Date().toISOString(),
            })

        if (!error) {
            alert('保存成功！')
        } else {
            alert('保存失败，请重试')
        }
        setIsSaving(false)
    }

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 w-48 skeleton rounded" />
                    <div className="h-64 skeleton rounded-xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white">
                    <User className="h-5 w-5" />
                </div>
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">个人资料</h1>
            </div>

            <Card>
                <CardContent className="p-6 space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex items-center justify-center text-white text-2xl">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="h-8 w-8" />
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold">{formData.full_name || '未设置昵称'}</h3>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">{email}</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                        <Input
                            label="昵称"
                            id="name"
                            value={formData.full_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                            placeholder="输入你的昵称"
                        />
                        <Input
                            label="手机号"
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="输入手机号"
                        />
                        <Input
                            label="地址"
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="输入居住地址"
                        />
                    </div>

                    <Button onClick={handleSave} isLoading={isSaving} className="w-full">
                        <Save className="h-4 w-4" />
                        保存修改
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
