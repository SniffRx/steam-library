import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Palette, Monitor, Settings as SettingsIcon } from 'lucide-react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Профиль',
        href: '/settings/profile',
        icon: User
    },
    {
        title: 'Пароль',
        href: '/settings/password',
        icon: Lock
    },
    {
        title: 'Внешний вид',
        href: '/settings/appearance',
        icon: Palette
    },
    {
        title: 'Устройства',
        href: '/settings/devices',
        icon: Monitor
    }
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="min-h-screen bg-[#0e1217] relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 px-6 py-8 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                            <SettingsIcon className="w-6 h-6 text-blue-400" />
                        </div>
                        <Heading
                            title="Настройки"
                            description="Управление профилем и параметрами аккаунта"
                        />
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Navigation */}
                    <motion.aside
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:w-64"
                    >
                        <nav className="sticky top-6 bg-[#1a1f29]/80 backdrop-blur-xl rounded-2xl p-4 border border-white/5 shadow-2xl">
                            <div className="space-y-1">
                                {sidebarNavItems.map((item, index) => {
                                    const isActive = currentPath === item.href;
                                    const Icon = item.icon;

                                    return (
                                        <motion.div
                                            key={`${item.href}-${index}`}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + index * 0.05 }}
                                        >
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                asChild
                                                className={cn(
                                                    'w-full justify-start gap-3 h-11 px-4 rounded-xl transition-all text-slate-300 hover:text-white hover:bg-white/5',
                                                    {
                                                        'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10 font-semibold': isActive
                                                    }
                                                )}
                                            >
                                                <Link href={item.href} prefetch className="flex items-center gap-3 w-full">
                                                    {Icon && (
                                                        <div className={cn(
                                                            'p-1.5 rounded-lg transition-colors',
                                                            isActive
                                                                ? 'bg-blue-500/20 text-blue-400'
                                                                : 'bg-slate-700/50 text-slate-400'
                                                        )}>
                                                            <Icon className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Divider */}
                            <Separator className="my-4 bg-white/5" />

                            {/* Info Section */}
                            <div className="px-4 py-3 rounded-xl bg-slate-900/40 border border-white/5">
                                <p className="text-xs text-slate-500 mb-1">Горячие клавиши</p>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <kbd className="px-2 py-1 rounded bg-slate-800 border border-white/10 font-mono">Ctrl</kbd>
                                    <span>+</span>
                                    <kbd className="px-2 py-1 rounded bg-slate-800 border border-white/10 font-mono">K</kbd>
                                    <span className="text-slate-500">поиск</span>
                                </div>
                            </div>
                        </nav>
                    </motion.aside>

                    {/* Mobile Separator */}
                    <Separator className="lg:hidden bg-white/5" />

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1"
                    >
                        <section className="max-w-3xl">
                            {children}
                        </section>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
