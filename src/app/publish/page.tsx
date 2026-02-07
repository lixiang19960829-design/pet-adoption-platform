'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, Plus, X, PawPrint } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { PetFormData } from '@/types'

export default function PublishPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploadingImages, setUploadingImages] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formData, setFormData] = useState<PetFormData>({
        name: '',
        species: 'dog',
        breed: '',
        age_years: null,
        age_months: null,
        gender: 'unknown',
        size: null,
        color: '',
        description: '',
        health_status: '',
        vaccination_status: '',
        location: '',
        adoption_requirements: '',
        images: [],
    })

    const supabase = createClient()

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/?login=required')
                return
            }
            setIsLoading(false)
        }
        checkAuth()
    }, [router, supabase])

    const speciesOptions = [
        { value: 'dog', label: '狗狗' },
        { value: 'cat', label: '猫咪' },
        { value: 'rabbit', label: '兔子' },
        { value: 'bird', label: '鸟类' },
        { value: 'other', label: '其他' },
    ]

    const genderOptions = [
        { value: 'male', label: '公' },
        { value: 'female', label: '母' },
        { value: 'unknown', label: '未知' },
    ]

    const sizeOptions = [
        { value: '', label: '请选择' },
        { value: 'small', label: '小型' },
        { value: 'medium', label: '中型' },
        { value: 'large', label: '大型' },
    ]

    const locationOptions = [
        { value: '', label: '请选择' },
        { value: '北京', label: '北京' },
        { value: '上海', label: '上海' },
        { value: '广州', label: '广州' },
        { value: '深圳', label: '深圳' },
        { value: '杭州', label: '杭州' },
        { value: '成都', label: '成都' },
        { value: '武汉', label: '武汉' },
        { value: '西安', label: '西安' },
    ]

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploadingImages(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const uploadedUrls: string[] = []

        for (const file of Array.from(files)) {
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

            const { error, data } = await supabase.storage
                .from('pet-images')
                .upload(fileName, file)

            if (!error && data) {
                const { data: { publicUrl } } = supabase.storage
                    .from('pet-images')
                    .getPublicUrl(data.path)
                uploadedUrls.push(publicUrl)
            }
        }

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...uploadedUrls],
        }))
        setUploadingImages(false)
    }

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }))
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.name) newErrors.name = '请填写宠物名字'
        if (!formData.location) newErrors.location = '请选择所在地区'
        if (!formData.description) newErrors.description = '请填写宠物描述'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setIsSubmitting(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/?login=required')
            return
        }

        const { error } = await supabase.from('pets').insert({
            publisher_id: user.id,
            name: formData.name,
            species: formData.species,
            breed: formData.breed || null,
            age_years: formData.age_years,
            age_months: formData.age_months,
            gender: formData.gender,
            size: formData.size || null,
            color: formData.color || null,
            description: formData.description,
            health_status: formData.health_status || null,
            vaccination_status: formData.vaccination_status || null,
            location: formData.location,
            adoption_requirements: formData.adoption_requirements || null,
            images: formData.images,
            status: 'available',
        })

        if (error) {
            console.error('Error publishing pet:', error)
            alert('发布失败，请稍后重试')
            setIsSubmitting(false)
            return
        }

        router.push('/manage/pets?success=true')
    }

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 w-48 skeleton rounded" />
                    <div className="h-64 skeleton rounded-xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                返回首页
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PawPrint className="h-5 w-5 text-[hsl(var(--primary))]" />
                        发布待领养宠物
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Images */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">宠物照片</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {formData.images.map((url, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <label className="aspect-square rounded-lg border-2 border-dashed border-[hsl(var(--border))] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[hsl(var(--primary))] transition-colors">
                                    {uploadingImages ? (
                                        <div className="animate-spin h-6 w-6 border-2 border-[hsl(var(--primary))] border-t-transparent rounded-full" />
                                    ) : (
                                        <>
                                            <Plus className="h-6 w-6 text-[hsl(var(--muted-foreground))]" />
                                            <span className="text-xs text-[hsl(var(--muted-foreground))]">添加照片</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        disabled={uploadingImages}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-[hsl(var(--foreground))]">基本信息</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Input
                                    label="宠物名字"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    error={errors.name}
                                    required
                                />
                                <Select
                                    label="种类"
                                    id="species"
                                    options={speciesOptions}
                                    value={formData.species}
                                    onChange={(e) => setFormData(prev => ({ ...prev, species: e.target.value as 'dog' | 'cat' | 'rabbit' | 'bird' | 'other' }))}
                                />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Input
                                    label="品种"
                                    id="breed"
                                    value={formData.breed}
                                    onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
                                    placeholder="例如：金毛、布偶猫"
                                />
                                <Select
                                    label="性别"
                                    id="gender"
                                    options={genderOptions}
                                    value={formData.gender}
                                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' | 'unknown' }))}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <Input
                                    label="年龄（岁）"
                                    id="age-years"
                                    type="number"
                                    min="0"
                                    max="30"
                                    value={formData.age_years || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, age_years: e.target.value ? parseInt(e.target.value) : null }))}
                                />
                                <Input
                                    label="年龄（月）"
                                    id="age-months"
                                    type="number"
                                    min="0"
                                    max="11"
                                    value={formData.age_months || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, age_months: e.target.value ? parseInt(e.target.value) : null }))}
                                />
                                <Select
                                    label="体型"
                                    id="size"
                                    options={sizeOptions}
                                    value={formData.size || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, size: (e.target.value as 'small' | 'medium' | 'large') || null }))}
                                />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Input
                                    label="毛色"
                                    id="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                    placeholder="例如：黑白、橘色"
                                />
                                <Select
                                    label="所在地区"
                                    id="location"
                                    options={locationOptions}
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    error={errors.location}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <Textarea
                            label="宠物描述"
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            error={errors.description}
                            placeholder="请描述宠物的性格、习惯、喜好等..."
                            className="min-h-[120px]"
                            required
                        />

                        {/* Health */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-[hsl(var(--foreground))]">健康状况</h3>
                            <Input
                                label="健康状态"
                                id="health"
                                value={formData.health_status}
                                onChange={(e) => setFormData(prev => ({ ...prev, health_status: e.target.value }))}
                                placeholder="例如：已绝育，身体健康"
                            />
                            <Input
                                label="疫苗情况"
                                id="vaccination"
                                value={formData.vaccination_status}
                                onChange={(e) => setFormData(prev => ({ ...prev, vaccination_status: e.target.value }))}
                                placeholder="例如：已完成全部疫苗接种"
                            />
                        </div>

                        {/* Requirements */}
                        <Textarea
                            label="领养须知（可选）"
                            id="requirements"
                            value={formData.adoption_requirements}
                            onChange={(e) => setFormData(prev => ({ ...prev, adoption_requirements: e.target.value }))}
                            placeholder="请描述对领养者的要求，如居住条件、时间精力等..."
                            className="min-h-[100px]"
                        />

                        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
                            <Upload className="h-5 w-5" />
                            发布宠物信息
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
