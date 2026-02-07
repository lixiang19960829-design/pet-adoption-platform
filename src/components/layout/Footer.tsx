import Link from 'next/link'
import { PawPrint, Heart, Github, Twitter, Instagram } from 'lucide-react'

export function Footer() {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        关于我们: [
            { href: '/about', label: '关于萌宠之家' },
            { href: '/success-stories', label: '领养成功案例' },
            { href: '/contact', label: '联系我们' },
        ],
        领养服务: [
            { href: '/', label: '浏览宠物' },
            { href: '/publish', label: '发布宠物' },
            { href: '/applications', label: '领养申请' },
        ],
        帮助支持: [
            { href: '/faq', label: '常见问题' },
            { href: '/guide', label: '领养指南' },
            { href: '/terms', label: '服务条款' },
        ],
    }

    const socialLinks = [
        { href: '#', icon: Github, label: 'GitHub' },
        { href: '#', icon: Twitter, label: 'Twitter' },
        { href: '#', icon: Instagram, label: 'Instagram' },
    ]

    return (
        <footer className="bg-[hsl(var(--card))] border-t border-[hsl(var(--border))]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] text-white">
                                <PawPrint className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold gradient-text">萌宠之家</span>
                        </Link>
                        <p className="text-[hsl(var(--muted-foreground))] text-sm mb-4 max-w-md">
                            萌宠之家是一个致力于连接待领养宠物与爱心领养者的平台。
                            我们相信每一只宠物都值得拥有一个温暖的家。
                        </p>
                        <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4 text-[hsl(var(--primary))]" />
                            <span className="text-sm text-[hsl(var(--muted-foreground))]">
                                用爱连接每一个生命
                            </span>
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="font-semibold text-[hsl(var(--foreground))] mb-4">{title}</h3>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-[hsl(var(--border))] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        © {currentYear} 萌宠之家. 保留所有权利.
                    </p>
                    <div className="flex items-center gap-4">
                        {socialLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="p-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))] transition-colors"
                                aria-label={link.label}
                            >
                                <link.icon className="h-5 w-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
