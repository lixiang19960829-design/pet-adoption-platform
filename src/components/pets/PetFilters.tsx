'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { PetFilters } from '@/types'

interface PetFiltersProps {
    filters: PetFilters
    onChange: (filters: PetFilters) => void
    onReset: () => void
}

export function PetFiltersBar({ filters, onChange, onReset }: PetFiltersProps) {
    const speciesOptions = [
        { value: '', label: '全部种类' },
        { value: 'dog', label: '狗狗' },
        { value: 'cat', label: '猫咪' },
        { value: 'rabbit', label: '兔子' },
        { value: 'bird', label: '鸟类' },
        { value: 'other', label: '其他' },
    ]

    const genderOptions = [
        { value: '', label: '全部性别' },
        { value: 'male', label: '公' },
        { value: 'female', label: '母' },
    ]

    const sizeOptions = [
        { value: '', label: '全部体型' },
        { value: 'small', label: '小型' },
        { value: 'medium', label: '中型' },
        { value: 'large', label: '大型' },
    ]

    const locationOptions = [
        { value: '', label: '全部地区' },
        { value: '北京', label: '北京' },
        { value: '上海', label: '上海' },
        { value: '广州', label: '广州' },
        { value: '深圳', label: '深圳' },
        { value: '杭州', label: '杭州' },
        { value: '成都', label: '成都' },
        { value: '武汉', label: '武汉' },
        { value: '西安', label: '西安' },
    ]

    const hasFilters = filters.species || filters.gender || filters.size || filters.location || filters.search

    return (
        <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-4 mb-6">
            {/* Search Bar */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <input
                    type="text"
                    placeholder="搜索宠物名称、品种..."
                    value={filters.search || ''}
                    onChange={(e) => onChange({ ...filters, search: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] transition-all"
                />
            </div>

            {/* Filter Options */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="hidden sm:inline">筛选</span>
                </div>

                <div className="flex flex-wrap gap-2 flex-1">
                    <Select
                        options={speciesOptions}
                        value={filters.species || ''}
                        onChange={(e) => onChange({ ...filters, species: e.target.value })}
                        className="w-auto min-w-[100px]"
                    />
                    <Select
                        options={genderOptions}
                        value={filters.gender || ''}
                        onChange={(e) => onChange({ ...filters, gender: e.target.value })}
                        className="w-auto min-w-[100px]"
                    />
                    <Select
                        options={sizeOptions}
                        value={filters.size || ''}
                        onChange={(e) => onChange({ ...filters, size: e.target.value })}
                        className="w-auto min-w-[100px]"
                    />
                    <Select
                        options={locationOptions}
                        value={filters.location || ''}
                        onChange={(e) => onChange({ ...filters, location: e.target.value })}
                        className="w-auto min-w-[100px]"
                    />
                </div>

                {hasFilters && (
                    <Button variant="ghost" size="sm" onClick={onReset} className="gap-1">
                        <X className="h-4 w-4" />
                        清除筛选
                    </Button>
                )}
            </div>
        </div>
    )
}
