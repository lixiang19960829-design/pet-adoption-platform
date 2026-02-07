import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date) {
    const now = new Date()
    const target = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)

    if (diffInSeconds < 60) return '刚刚'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} 分钟前`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} 小时前`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} 天前`
    return formatDate(date)
}

export function getSpeciesLabel(species: string) {
    const labels: Record<string, string> = {
        dog: '狗狗',
        cat: '猫咪',
        rabbit: '兔子',
        bird: '鸟类',
        other: '其他',
    }
    return labels[species] || species
}

export function getGenderLabel(gender: string) {
    const labels: Record<string, string> = {
        male: '公',
        female: '母',
        unknown: '未知',
    }
    return labels[gender] || gender
}

export function getSizeLabel(size: string) {
    const labels: Record<string, string> = {
        small: '小型',
        medium: '中型',
        large: '大型',
    }
    return labels[size] || size
}

export function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
        available: '待领养',
        pending: '审核中',
        adopted: '已领养',
    }
    return labels[status] || status
}

export function getApplicationStatusLabel(status: string) {
    const labels: Record<string, string> = {
        pending: '待审核',
        approved: '已通过',
        rejected: '已拒绝',
    }
    return labels[status] || status
}
