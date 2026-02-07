'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PawPrint, Heart, Users, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PetCard } from '@/components/pets/PetCard'
import { PetFiltersBar } from '@/components/pets/PetFilters'
import { Button } from '@/components/ui/Button'
import type { Pet, PetFilters } from '@/types'

export default function HomePage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<PetFilters>({})
  const supabase = createClient()

  useEffect(() => {
    fetchPets()
  }, [filters])

  const fetchPets = async () => {
    setIsLoading(true)

    let query = supabase
      .from('pets')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false })

    if (filters.species) {
      query = query.eq('species', filters.species)
    }
    if (filters.gender) {
      query = query.eq('gender', filters.gender)
    }
    if (filters.size) {
      query = query.eq('size', filters.size)
    }
    if (filters.location) {
      query = query.eq('location', filters.location)
    }
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,breed.ilike.%${filters.search}%`)
    }

    const { data, error } = await query

    if (!error && data) {
      setPets(data)
    }
    setIsLoading(false)
  }

  const resetFilters = () => {
    setFilters({})
  }

  const stats = [
    { icon: PawPrint, label: '待领养宠物', value: '500+' },
    { icon: Heart, label: '成功领养', value: '2000+' },
    { icon: Users, label: '爱心家庭', value: '3000+' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--secondary))] to-[hsl(var(--accent))] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6 animate-fade-in">
              <PawPrint className="h-5 w-5" />
              <span className="text-sm font-medium">让爱找到归宿</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-up">
              遇见你的
              <span className="block mt-2">毛茸茸的家人</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              萌宠之家致力于为每一只待领养的毛孩子找到温暖的家。
              <br className="hidden md:block" />
              在这里，爱与陪伴从遇见开始。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <Button
                size="lg"
                className="bg-white text-[hsl(var(--primary))] hover:bg-white/90"
                onClick={() => document.getElementById('pets-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Search className="h-5 w-5" />
                浏览宠物
              </Button>
              <Link
                href="/publish"
                className="inline-flex items-center justify-center font-medium transition-all duration-200 focus-ring rounded-lg text-base px-6 py-3 gap-2 border-2 border-white text-white hover:bg-white/20"
              >
                发布领养信息
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-16 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.3s' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex p-3 rounded-xl bg-white/20 backdrop-blur-sm mb-2">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Pets Section */}
      <section id="pets-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-2">
            寻找你的新伙伴
          </h2>
          <p className="text-[hsl(var(--muted-foreground))]">
            这些可爱的小家伙正在等待一个温暖的家
          </p>
        </div>

        {/* Filters */}
        <PetFiltersBar
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
        />

        {/* Pet Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <div className="aspect-[4/3] skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-5 skeleton rounded w-2/3" />
                  <div className="h-4 skeleton rounded w-1/2" />
                  <div className="h-4 skeleton rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : pets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex p-4 rounded-full bg-[hsl(var(--muted))] mb-4">
              <PawPrint className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
            </div>
            <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
              暂无符合条件的宠物
            </h3>
            <p className="text-[hsl(var(--muted-foreground))] mb-4">
              试试调整筛选条件或稍后再来看看
            </p>
            <Button variant="outline" onClick={resetFilters}>
              清除筛选条件
            </Button>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-[hsl(var(--muted))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              有宠物需要寻找新家吗？
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              如果你无法继续照顾你的宠物，或者发现了需要帮助的流浪动物，
              我们可以帮助它们找到新的家庭。
            </p>
            <Link
              href="/publish"
              className="inline-flex items-center justify-center font-medium transition-all duration-200 focus-ring rounded-lg text-base px-6 py-3 gap-2 bg-white text-[hsl(var(--primary))] hover:bg-white/90"
            >
              发布领养信息
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
