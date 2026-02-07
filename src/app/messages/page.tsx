'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Mail, MailOpen, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatRelativeTime } from '@/lib/utils'
import type { Message } from '@/types'

export default function MessagesPage() {
    const router = useRouter()
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchMessages = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/?login=required')
                return
            }

            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('recipient_id', user.id)
                .order('created_at', { ascending: false })

            if (!error && data) {
                setMessages(data)
            }
            setIsLoading(false)
        }

        fetchMessages()
    }, [router, supabase])

    const markAsRead = async (id: string) => {
        const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('id', id)

        if (!error) {
            setMessages(msgs => msgs.map(m => m.id === id ? { ...m, is_read: true } : m))
        }
    }

    const deleteMessage = async (id: string) => {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id)

        if (!error) {
            setMessages(msgs => msgs.filter(m => m.id !== id))
        }
    }

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 w-48 skeleton rounded" />
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 skeleton rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white">
                    <Bell className="h-5 w-5" />
                </div>
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">消息中心</h1>
                {messages.filter(m => !m.is_read).length > 0 && (
                    <span className="px-2 py-0.5 text-xs bg-[hsl(var(--error))] text-white rounded-full">
                        {messages.filter(m => !m.is_read).length}
                    </span>
                )}
            </div>

            {messages.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Bell className="h-12 w-12 text-[hsl(var(--muted-foreground))] mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">暂无消息</h3>
                        <p className="text-[hsl(var(--muted-foreground))]">
                            当有新的通知时会显示在这里
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {messages.map((msg) => (
                        <Card key={msg.id} className={!msg.is_read ? 'border-[hsl(var(--primary))]' : ''}>
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${msg.is_read ? 'bg-[hsl(var(--muted))]' : 'bg-[hsl(var(--primary)/0.1)]'}`}>
                                        {msg.is_read ? (
                                            <MailOpen className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                                        ) : (
                                            <Mail className="h-5 w-5 text-[hsl(var(--primary))]" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-[hsl(var(--foreground))]">{msg.title}</h3>
                                        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1 line-clamp-2">
                                            {msg.content}
                                        </p>
                                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
                                            {formatRelativeTime(msg.created_at)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {!msg.is_read && (
                                            <Button variant="ghost" size="sm" onClick={() => markAsRead(msg.id)}>
                                                标为已读
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteMessage(msg.id)}
                                            className="text-[hsl(var(--error))]"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
