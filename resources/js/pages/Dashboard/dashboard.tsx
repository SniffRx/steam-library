import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { motion } from 'framer-motion';

interface UserResult {
    steamId: string;
    name: string;
    avatar: string;
}

export default function Dashboard() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UserResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (query.length < 3) {
            setResults([]);
            return;
        }
        setLoading(true);
        axios.get('/steam/user/search', { params: { query } })
            .then(res => {
                const data = res.data;
                setResults(Array.isArray(data?.results) ? data.results : []);
                setError(null);
            })
            .catch(() => {
                setError('Ошибка поиска. Попробуйте еще раз.');
                setResults([]);
            })
            .finally(() => setLoading(false));
    }, [query]);

    const handleSelect = (steamId: string) => {
        router.visit(`/steam/user/${encodeURIComponent(steamId)}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <div className="min-h-screen bg-[#0e1217] relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl"></div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-['Instrument_Sans']">
                            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                Поиск пользователя Steam
                            </span>
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Введите SteamID или имя пользователя для поиска профиля
                        </p>
                    </motion.div>

                    {/* Search Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-[#1a1f29]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 shadow-2xl mb-6"
                    >
                        {/* Search Input */}
                        <div className="relative mb-6">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Введите SteamID или имя пользователя..."
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900/50 border border-white/5 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-lg"
                                autoFocus
                            />
                            {loading && (
                                <div className="absolute inset-y-0 right-4 flex items-center">
                                    <svg className="animate-spin h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
                            >
                                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </motion.div>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-8">
                                <div className="inline-flex items-center gap-3 text-slate-400">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Поиск пользователей...</span>
                                </div>
                            </div>
                        )}

                        {/* Results List */}
                        {results.length > 0 && !loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-2"
                            >
                                <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Найдено пользователей: {results.length}
                                </h3>
                                <div className="max-h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                    {results.map((user, index) => (
                                        <motion.div
                                            key={user.steamId}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            onClick={() => handleSelect(user.steamId)}
                                            className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:border-blue-400/30 hover:bg-slate-900/60 transition-all duration-300 cursor-pointer group"
                                        >
                                            <div className="relative">
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-14 h-14 rounded-full border-2 border-white/10 group-hover:border-blue-400/50 transition-colors"
                                                />
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1a1f29]"></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-sm text-slate-500 font-mono">
                                                    {user.steamId}
                                                </p>
                                            </div>
                                            <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Empty State */}
                        {!loading && query.length >= 3 && results.length === 0 && !error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12"
                            >
                                <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-slate-400 mb-2">Пользователи не найдены</p>
                                <p className="text-sm text-slate-600">Попробуйте изменить поисковый запрос</p>
                            </motion.div>
                        )}

                        {/* Initial State */}
                        {query.length < 3 && !loading && (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <p className="text-slate-400 mb-2">Начните вводить для поиска</p>
                                <p className="text-sm text-slate-600">Минимум 3 символа</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Privacy Notice */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-blue-500/10 backdrop-blur-md rounded-2xl p-6 border border-blue-500/20"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-blue-300 font-semibold mb-2">Важная информация</h4>
                                <p className="text-blue-200/80 text-sm leading-relaxed">
                                    Чтобы приложение корректно получало информацию о вашем профиле и играх, пожалуйста,
                                    <span className="font-semibold text-blue-300"> разрешите просмотр вашего Steam аккаунта</span> в
                                    настройках приватности Steam. Это необходимо для отображения игрового прогресса и статистики.
                                </p>
                                <a
                                    href="https://steamcommunity.com/my/edit/settings"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 mt-3 text-sm text-blue-300 hover:text-blue-200 transition-colors"
                                >
                                    Открыть настройки Steam
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(15, 23, 42, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(59, 130, 246, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(59, 130, 246, 0.5);
                }
            `}</style>
        </AppLayout>
    );
}
