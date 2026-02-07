'use client'

import { useState } from 'react'
import { X, Mail, Lock, Github } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin')
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const supabase = createClient()

    if (!isOpen) return null

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                })
                if (error) throw error
                alert('注册成功！请检查邮箱完成验证。')
                onClose()
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                onClose()
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message === 'Invalid login credentials' ? '邮箱或密码错误' : err.message)
            } else {
                setError('发生未知错误')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleOAuth = async (provider: 'google' | 'github') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('发生未知错误')
            }
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="w-full max-w-md bg-[hsl(var(--card))] rounded-2xl shadow-xl overflow-hidden border border-[hsl(var(--border))]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
                    <h2 className="text-lg font-semibold">
                        {mode === 'signin' ? '欢迎回来' : '创建账号'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-[hsl(var(--muted))] transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* OAuth Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => handleOAuth('github')}
                            className="w-full gap-2"
                        >
                            <Github className="h-4 w-4" />
                            GitHub
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleOAuth('google')}
                            className="w-full gap-2"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-[hsl(var(--border))]" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[hsl(var(--card))] px-2 text-[hsl(var(--muted-foreground))]">
                                或使用邮箱
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-[hsl(var(--error))] bg-[hsl(var(--error))]/10 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                label="邮箱地址"
                                startIcon={<Mail className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />}
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                label="密码"
                                startIcon={<Lock className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />}
                            />
                        </div>

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            {mode === 'signin' ? '登录' : '注册'}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-[hsl(var(--muted-foreground))]">
                            {mode === 'signin' ? '还没有账号？' : '已有账号？'}
                        </span>
                        <button
                            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                            className="ml-1 text-[hsl(var(--primary))] hover:underline font-medium"
                        >
                            {mode === 'signin' ? '立即注册' : '直接登录'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
