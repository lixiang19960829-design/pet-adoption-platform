'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Heart, MessageSquare, PawPrint, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Button } from '@/components/ui/Button'
import { LoginModal } from '@/components/auth/LoginModal'
import { cn } from '@/lib/utils'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isLoginOpen, setIsLoginOpen] = useState(false)
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setIsLoading(false)
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [supabase.auth])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setUser(null)
    }

    const navLinks = [
        { href: '/', label: '首页', icon: PawPrint },
        { href: '/favorites', label: '收藏', icon: Heart },
        { href: '/messages', label: '消息', icon: MessageSquare },
    ]

    return (
        <>
            <header className="sticky top-0 z-50 w-full glass border-b border-[hsl(var(--border))]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white group-hover:scale-110 transition-transform">
                                <PawPrint className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold gradient-text hidden sm:block">
                                萌宠之家 🐾
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                                >
                                    <link.icon className="h-4 w-4" />
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            <ThemeToggle />

                            {isLoading ? (
                                <div className="h-10 w-10 rounded-full skeleton" />
                            ) : user ? (
                                <div className="relative group">
                                    <button className="flex items-center gap-2 p-1 rounded-full hover:bg-[hsl(var(--muted))] transition-colors">
                                        {user.user_metadata?.avatar_url ? (
                                            <img
                                                src={user.user_metadata.avatar_url}
                                                alt="头像"
                                                className="h-8 w-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] flex items-center justify-center text-white">
                                                <User className="h-4 w-4" />
                                            </div>
                                        )}
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-[hsl(var(--card))] rounded-xl shadow-lg border border-[hsl(var(--border))] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        <div className="px-4 py-2 border-b border-[hsl(var(--border))]">
                                            <p className="text-sm font-medium truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[hsl(var(--muted))] transition-colors"
                                        >
                                            <User className="h-4 w-4" />
                                            个人资料
                                        </Link>
                                        <Link
                                            href="/publish"
                                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[hsl(var(--muted))] transition-colors"
                                        >
                                            <PawPrint className="h-4 w-4" />
                                            发布宠物
                                        </Link>
                                        <Link
                                            href="/manage/pets"
                                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[hsl(var(--muted))] transition-colors"
                                        >
                                            <Heart className="h-4 w-4" />
                                            我的宠物
                                        </Link>
                                        <Link
                                            href="/applications"
                                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[hsl(var(--muted))] transition-colors"
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                            我的申请
                                        </Link>
                                        <hr className="my-2 border-[hsl(var(--border))]" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-[hsl(var(--error))] hover:bg-[hsl(var(--muted))] transition-colors"
                                        >
                                            退出登录
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="hidden sm:flex items-center gap-2">
                                    <Button onClick={() => setIsLoginOpen(true)}>
                                        登录 / 注册
                                    </Button>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div
                        className={cn(
                            'md:hidden overflow-hidden transition-all duration-300',
                            isMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
                        )}
                    >
                        <nav className="flex flex-col gap-1 pt-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                                >
                                    <link.icon className="h-5 w-5" />
                                    {link.label}
                                </Link>
                            ))}
                            {!user && (
                                <>
                                    <hr className="my-2 border-[hsl(var(--border))]" />
                                    <Button className="w-full justify-center" onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }}>
                                        登录 / 注册
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
            />
        </>
    )
}
