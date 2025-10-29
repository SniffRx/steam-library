import { Auth, BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { UserX, Search, ArrowLeft, ExternalLink } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'User Not Found', href: '#' },
];

export default function UserNotFound() {
    const { auth, steamID } = usePage<{
        auth: Auth;
        steamID: string;
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Пользователь не найден - Steam Library" />

            <div className="min-h-screen bg-[#0e1217] relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-2xl w-full"
                    >
                        {/* Main Card */}
                        <div className="bg-[#1a1f29]/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/5 shadow-2xl text-center">
                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-slate-500/20 to-slate-600/20 border border-slate-500/30 mb-8"
                            >
                                <UserX className="w-12 h-12 text-slate-400" />
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl md:text-4xl font-bold mb-4 font-['Instrument_Sans'] bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
                            >
                                Пользователь не найден
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg text-slate-400 mb-8 max-w-md mx-auto leading-relaxed"
                            >
                                Этот игрок ещё не зарегистрировался в Steam Library. Пригласите его присоединиться, чтобы отслеживать игровой прогресс вместе!
                            </motion.p>

                            {/* Steam ID Info */}
                            {steamID && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/50 border border-white/5 text-sm text-slate-400 mb-8"
                                >
                                    <Search className="w-4 h-4" />
                                    <span className="font-mono">{steamID}</span>
                                </motion.div>
                            )}

                            {/* Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
                            >
                                {/* Open Steam Profile */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => window.open(`https://steamcommunity.com/profiles/${steamID}`, '_blank', 'noopener,noreferrer')}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 text-base font-semibold hover:from-blue-400 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-blue-500/25"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    Открыть в Steam
                                </motion.button>

                                {/* Back to Profile */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex-1"
                                >
                                    <Link
                                        href={auth.user ? `/steam/user/${auth.user.steamID}` : '/dashboard'}
                                        className="inline-flex items-center justify-center gap-2 w-full rounded-xl border border-white/10 bg-white/5 text-white px-6 py-3 text-base font-medium hover:bg-white/10 transition-all duration-300"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        {auth.user ? 'Мой профиль' : 'На главную'}
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Additional Info Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="grid md:grid-cols-3 gap-4 mt-6"
                        >
                            <div className="bg-[#1a1f29]/60 backdrop-blur-xl rounded-2xl p-6 border border-white/5 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 mb-3">
                                    <Search className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">Поиск игроков</h3>
                                <p className="text-sm text-slate-400">Найдите друзей по Steam ID или никнейму</p>
                            </div>

                            <div className="bg-[#1a1f29]/60 backdrop-blur-xl rounded-2xl p-6 border border-white/5 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 mb-3">
                                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-white mb-2">Пригласите друзей</h3>
                                <p className="text-sm text-slate-400">Расскажите друзьям о Steam Library</p>
                            </div>

                            <div className="bg-[#1a1f29]/60 backdrop-blur-xl rounded-2xl p-6 border border-white/5 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 mb-3">
                                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-white mb-2">Статистика игр</h3>
                                <p className="text-sm text-slate-400">Отслеживайте прогресс и достижения</p>
                            </div>
                        </motion.div>

                        {/* Footer Note */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-center text-sm text-slate-500 mt-8"
                        >
                            💡 Подсказка: Убедитесь, что профиль Steam пользователя открыт для публичного просмотра
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
