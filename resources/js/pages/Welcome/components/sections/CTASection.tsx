import { motion } from 'framer-motion';
import { Link, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { useState } from 'react';

export const CTASection = () => {
    const { auth } = usePage<SharedData>().props;

    // Генерация случайных данных профиля
    const [userProfile] = useState(() => ({
        level: Math.floor(Math.random() * 30) + 50, // 50-80
        totalGames: Math.floor(Math.random() * 100) + 350, // 350-450
        friends: Math.floor(Math.random() * 50), // 0-50
        hoursPlayed: (Math.random() * 30 + 20).toFixed(1), // 20-50
        wishlist: Math.floor(Math.random() * 20) + 5, // 5-25
        accountAge: `${Math.floor(Math.random() * 5) + 5} лет`, // 5-10 лет
    }));

    const [recentGames] = useState(() => [
        {
            name: 'Counter-Strike 2',
            image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
            hours: (Math.random() * 30 + 10).toFixed(0),
            progress: Math.floor(Math.random() * 30) + 70
        },
        {
            name: 'Shift Happens',
            image: 'https://cdn.akamai.steamstatic.com/steam/apps/359840/header.jpg',
            hours: (Math.random() * 10 + 5).toFixed(0),
            progress: Math.floor(Math.random() * 40) + 40
        },
        {
            name: 'Necesse',
            image: 'https://cdn.akamai.steamstatic.com/steam/apps/1169040/header.jpg',
            hours: (Math.random() * 5).toFixed(0),
            progress: Math.floor(Math.random() * 30)
        },
        {
            name: 'Terraria',
            image: 'https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg',
            hours: (Math.random() * 20 + 10).toFixed(0),
            progress: 100
        },
        {
            name: 'Amnesia',
            image: 'https://cdn.akamai.steamstatic.com/steam/apps/57300/header.jpg',
            hours: (Math.random() * 5).toFixed(0),
            progress: Math.floor(Math.random() * 20)
        }
    ]);

    return (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-4xl font-bold mb-4 font-['Instrument_Sans']">
                    Ваш профиль игрока
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    Полная статистика, достижения и аналитика вашего Steam аккаунта
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left - User Profile Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="lg:col-span-1"
                >
                    <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-6 border border-white/5 h-full">
                        {/* Profile Header */}
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1">
                                    <div className="w-full h-full rounded-full bg-[#1a1f29] flex items-center justify-center">
                                        <svg className="w-10 h-10 text-blue-400" viewBox="0 0 32 32" fill="currentColor">
                                            <path d="M2.57 20.027C4.3 25.796 9.654 30 15.99 30c7.737 0 14-6.268 14-14 0-7.732-6.263-14-14-14C8.566 2 2.492 7.772 2.012 15.07c0 2.097 0 2.972.558 4.957z" />
                                            <path d="M15.27 12.563l-3.428 4.976c-.808-.037-1.622.192-2.297.636L2.018 15.078S1.844 17.942 2.57 20.076l5.321 2.195c.267 1.193 1.086 2.24 2.295 2.743 1.977.826 4.257-.114 5.08-2.09.214-.517.314-1.06.3-1.6l5.025-3.501c3.935 0 6.321-2.391 6.321-5.328 0-2.937-2.386-5.326-6.321-5.326-2.835 0-5.479 2.474-5.32 5.396zm-.824 9.015c-.636 1.528-2.393 2.252-3.92 1.617-.704-.293-1.236-.83-1.543-1.47l1.732.717c1.126.469 2.418-.064 2.886-1.189.47-1.126-.062-2.419-1.187-2.887l-1.79-.659c.691-.262 1.476-.271 2.21.034.74.307 1.314.887 1.618 1.627.304.74.303 1.557-.005 2.295zm6.168-6.535c-1.954 0-3.545-1.592-3.545-3.55 0-1.956 1.591-3.548 3.545-3.548 1.955 0 3.546 1.592 3.546 3.548 0 1.958-1.591 3.55-3.546 3.55zm-2.656-3.555c0-1.472 1.193-2.666 2.662-2.666 1.471 0 2.664 1.194 2.664 2.666 0 1.473-1.193 2.666-2.664 2.666-1.469 0-2.662-1.193-2.662-2.666z" fill="white" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white border-2 border-[#1a1f29]">
                                    {userProfile.level}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">Serjik ( - , -)</h3>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                        Online
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <span className="text-xs text-slate-400">Игр</span>
                                </div>
                                <div className="text-2xl font-bold text-blue-400">{userProfile.totalGames}</div>
                            </div>

                            <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="text-xs text-slate-400">Друзей</span>
                                </div>
                                <div className="text-2xl font-bold text-purple-400">{userProfile.friends}</div>
                            </div>

                            <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-xs text-slate-400">Часов</span>
                                </div>
                                <div className="text-2xl font-bold text-yellow-400">{userProfile.hoursPlayed}</div>
                            </div>

                            <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span className="text-xs text-slate-400">В желаемом</span>
                                </div>
                                <div className="text-2xl font-bold text-pink-400">{userProfile.wishlist}</div>
                            </div>
                        </div>

                        {/* Status Badges */}
                        <div className="space-y-2">
                            <h4 className="text-xs text-slate-400 mb-3">Статус банов</h4>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                    ✓ Game Bans: 0
                                </span>
                                <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                    ✓ VAC Bans: 0
                                </span>
                                <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                    ✓ Community Ban
                                </span>
                                <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                    ✓ Trade Ban
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right - Recent Games */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="lg:col-span-2"
                >
                    <div className="bg-[#1a1f29]/60 backdrop-blur-xl rounded-2xl p-6 border border-white/5 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Недавно сыгранные
                            </h3>
                            <span className="text-xs text-slate-400">5 игр</span>
                        </div>

                        <div className="space-y-3">
                            {recentGames.map((game, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-4 bg-slate-900/40 backdrop-blur-sm rounded-xl p-4 border border-white/5 hover:border-blue-400/30 transition-all duration-300 group"
                                >
                                    <img
                                        src={game.image}
                                        alt={game.name}
                                        className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm mb-2 truncate">{game.name}</h4>
                                        <div className="flex items-center gap-3 text-xs text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {game.hours} часов
                                            </span>
                                            <span>•</span>
                                            <span>{game.progress}% прогресс</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center relative">
                                            <svg className="w-12 h-12 transform -rotate-90">
                                                <circle
                                                    cx="24"
                                                    cy="24"
                                                    r="20"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    className="text-slate-700"
                                                />
                                                <circle
                                                    cx="24"
                                                    cy="24"
                                                    r="20"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeDasharray={`${(game.progress / 100) * 125.6} 125.6`}
                                                    className={game.progress === 100 ? 'text-green-400' : 'text-blue-400'}
                                                />
                                            </svg>
                                            <span className="absolute text-xs font-bold">{game.progress}%</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <motion.div
                            className="mt-6 pt-6 border-t border-white/5"
                            whileHover={{ scale: 1.02 }}
                        >
                            <Link
                                href={auth.user ? route('dashboard') : route('login')}
                                className="flex items-center justify-center gap-3 w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4 text-base font-semibold text-white hover:from-blue-400 hover:to-cyan-400 transition-all duration-300 shadow-xl shadow-blue-500/25"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
                                    <path d="M2.57 20.027C4.3 25.796 9.654 30 15.99 30c7.737 0 14-6.268 14-14 0-7.732-6.263-14-14-14C8.566 2 2.492 7.772 2.012 15.07c0 2.097 0 2.972.558 4.957z" />
                                </svg>
                                {auth.user ? 'Открыть свой профиль' : 'Подключить Steam аккаунт'}
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            <p className="text-center text-sm text-slate-500 mt-8">
                🔒 Безопасная авторизация через Steam API. Мы используем только публичные данные.
            </p>
        </section>
    );
};
