import { motion } from 'framer-motion';
import { Link, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { useState } from 'react';

export const HeroSection = () => {
    const { auth } = usePage<SharedData>().props;

    // Генерация случайных данных
    const [featuredGame] = useState(() => ({
        hours: Math.floor(Math.random() * 1000) + 1500, // 1500-2500
        progress: 100
    }));

    const [games] = useState(() => [
        {
            name: 'Shift Happens',
            hours: Math.floor(Math.random() * 30) + 10, // 10-40
            progress: Math.floor(Math.random() * 40) + 50, // 50-90
            color: 'cyan'
        },
        {
            name: 'Necesse',
            hours: Math.floor(Math.random() * 5), // 0-5
            progress: Math.floor(Math.random() * 20), // 0-20
            color: 'slate'
        },
        {
            name: 'Terraria',
            hours: Math.floor(Math.random() * 200) + 300, // 300-500
            progress: 100,
            color: 'green'
        },
        {
            name: 'Amnesia',
            hours: Math.floor(Math.random() * 5), // 0-5
            progress: Math.floor(Math.random() * 15), // 0-15
            color: 'slate'
        }
    ]);

    return (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-14">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                {/* Left Column - Text */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex-1 space-y-6"
                >
                    <h1 className="font-['Instrument_Sans'] text-5xl lg:text-6xl leading-tight font-bold">
                        Управляй своей{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            игровой библиотекой
                        </span>
                    </h1>

                    <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                        Отслеживайте прогресс в играх Steam, анализируйте статистику и управляйте своей коллекцией.
                        Все ваши игры в одном удобном интерфейсе.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href={auth.user ? route('dashboard') : route('login')}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 shadow-xl shadow-blue-500/25"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                {auth.user ? 'Перейти в кабинет' : 'Начать бесплатно'}
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <a
                                href="#features"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-8 py-3.5 text-base font-medium hover:bg-white/10 transition-all duration-300"
                            >
                                Узнать больше
                            </a>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Right Column - Dashboard Preview */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex-1 relative"
                >
                    <div className="relative bg-[#1a1f29]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl">
                        {/* Browser controls */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <span className="text-xs text-slate-500 font-medium">Моя библиотека игр</span>
                        </div>

                        {/* Game Cards Grid */}
                        <div className="space-y-3">
                            {/* Featured Game */}
                            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-xl p-4 border border-orange-500/20">
                                <div className="flex items-center gap-3 mb-3">
                                    <img
                                        src="https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg"
                                        alt="CS2"
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-sm mb-1">Counter-Strike 2</h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
                                                </svg>
                                                {featuredGame.hours}ч
                                            </span>
                                            <span>•</span>
                                            <span className="text-green-400">Пройдено</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Other Games Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {games.map((game, i) => (
                                    <div
                                        key={i}
                                        className="bg-slate-900/40 backdrop-blur-lg rounded-lg p-3 border border-white/5 hover:border-blue-400/30 transition-all duration-300"
                                    >
                                        <h4 className="text-xs font-medium mb-2 truncate">{game.name}</h4>
                                        <div className="space-y-1.5">
                                            <div className="h-1 bg-slate-800/50 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${
                                                        game.progress === 100
                                                            ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                                            : game.progress > 0
                                                                ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                                                                : 'bg-slate-700'
                                                    }`}
                                                    style={{ width: `${game.progress}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-slate-500">{game.hours}ч</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
