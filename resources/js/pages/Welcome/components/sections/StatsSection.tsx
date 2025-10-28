import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const StatsSection = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [stats] = useState(() => ({
        total: Math.floor(Math.random() * 100) + 350, // 350-450
        completed: Math.floor(Math.random() * 15) + 25, // 25-40
        inProgress: 0, // будет вычислено
        completionPercent: 0 // будет вычислено
    }));

    useEffect(() => {
        stats.inProgress = stats.total - stats.completed;
        stats.completionPercent = Math.round((stats.completed / stats.total) * 100);
    }, [stats]);

    const games = [
        {
            name: 'Counter-Strike 2',
            image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
            hours: Math.floor(Math.random() * 100) + 150, // 1500-2500
            progress: 100,
            status: 'Пройдено'
        },
        {
            name: 'Shift Happens',
            image: 'https://cdn.akamai.steamstatic.com/steam/apps/359840/header.jpg',
            hours: Math.floor(Math.random() * 30) + 10, // 10-40
            progress: Math.floor(Math.random() * 40) + 50, // 50-90
            status: 'В процессе'
        },
        {
            name: 'Necesse',
            image: 'https://cdn.akamai.steamstatic.com/steam/apps/1169040/header.jpg',
            hours: Math.floor(Math.random() * 5), // 0-5
            progress: Math.floor(Math.random() * 20), // 0-20
            status: 'Отметить'
        },
        {
            name: 'Terraria',
            image: 'https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg',
            hours: Math.floor(Math.random() * 200) + 300, // 300-500
            progress: 100,
            status: 'Пройдено'
        }
    ];

    return (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-8 lg:p-12 border border-white/5"
            >
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">Мощные инструменты управления</h3>
                    <p className="text-slate-400">Фильтруйте и сортируйте игры так, как вам удобно</p>
                </div>

                {/* Filter Panel Demo */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left - Filters */}
                    <div className="bg-[#1a1f29]/60 backdrop-blur-lg rounded-xl p-6 border border-white/5">
                        <h4 className="font-semibold mb-4 text-sm text-slate-300">Фильтры</h4>

                        {/* Search */}
                        <div className="mb-6">
                            <label className="text-xs text-slate-400 mb-2 block">Поиск</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Название игры..."
                                    className="w-full bg-slate-900/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                                <svg className="absolute right-3 top-2.5 w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Sort */}
                        <div className="mb-6">
                            <label className="text-xs text-slate-400 mb-2 block">Сортировка</label>
                            <select className="w-full bg-slate-900/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 transition-colors">
                                <option>Recent</option>
                                <option>По названию</option>
                                <option>По времени игры</option>
                                <option>По прогрессу</option>
                            </select>
                        </div>

                        {/* Status Filters */}
                        <div>
                            <label className="text-xs text-slate-400 mb-3 block">Статус</label>
                            <div className="space-y-2">
                                {[
                                    { id: 'all', label: 'Все', count: stats.total },
                                    { id: 'completed', label: 'Пройдено', count: stats.completed },
                                    { id: 'progress', label: 'В процессе', count: stats.inProgress }
                                ].map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => setActiveFilter(filter.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                                            activeFilter === filter.id
                                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                : 'bg-slate-900/30 text-slate-400 border border-white/5 hover:bg-slate-900/50'
                                        }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${
                                                filter.id === 'all' ? 'bg-slate-400' :
                                                    filter.id === 'completed' ? 'bg-green-400' :
                                                        'bg-yellow-400'
                                            }`}></div>
                                            {filter.label}
                                        </span>
                                        <span className="text-xs opacity-60">{filter.count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="mt-6 pt-6 border-t border-white/5">
                            <label className="text-xs text-slate-400 mb-3 block">Статистика</label>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-slate-400">Завершено:</span>
                                        <span className="text-cyan-400 font-medium">{stats.completed}</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-900/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                                            style={{ width: `${stats.completionPercent}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-slate-400">В процессе:</span>
                                        <span className="text-green-400 font-medium">{stats.inProgress}</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-900/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                                            style={{ width: `${100 - stats.completionPercent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-3">{stats.completionPercent}% завершено</p>
                        </div>
                    </div>

                    {/* Right - Game Grid Preview */}
                    <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-start">
                        {games.map((game, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-[#1a1f29]/60 backdrop-blur-lg rounded-xl overflow-hidden border border-white/5 hover:border-blue-400/30 transition-all duration-300 group cursor-pointer"
                            >
                                <div className="relative h-24 overflow-hidden">
                                    <img
                                        src={game.image}
                                        alt={game.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f29] to-transparent"></div>
                                </div>
                                <div className="p-3">
                                    <h5 className="font-semibold text-sm mb-2 truncate">{game.name}</h5>
                                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {game.hours}ч
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            game.status === 'Пройдено'
                                                ? 'bg-green-500/20 text-green-400'
                                                : game.status === 'В процессе'
                                                    ? 'bg-yellow-500/20 text-yellow-400'
                                                    : 'bg-slate-500/20 text-slate-400'
                                        }`}>
                                            {game.status}
                                        </span>
                                    </div>
                                    <div className="h-1 bg-slate-900/50 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${
                                                game.progress === 100
                                                    ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                                    : game.progress > 0
                                                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                                                        : 'bg-slate-700'
                                            }`}
                                            style={{ width: `${game.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className="grid md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div>
                            <h5 className="text-sm font-semibold mb-1">Быстрый поиск</h5>
                            <p className="text-xs text-slate-400">Мгновенный поиск по названию среди всех игр</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                            </svg>
                        </div>
                        <div>
                            <h5 className="text-sm font-semibold mb-1">Гибкая сортировка</h5>
                            <p className="text-xs text-slate-400">По времени, прогрессу, названию или дате</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h5 className="text-sm font-semibold mb-1">Визуальная статистика</h5>
                            <p className="text-xs text-slate-400">Наглядный прогресс по всей библиотеке</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
