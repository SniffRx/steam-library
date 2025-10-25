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
                setError('[translate:Ошибка поиска]');
                setResults([]);
            })
            .finally(() => setLoading(false));
    }, [query]);

    const handleSelect = (steamId: string) => {
        router.visit(`/steam/user/${encodeURIComponent(steamId)}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            {/* Центрируем весь блок по центру экрана */}
            <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950 overflow-hidden">
                {/* Анимированный фон */}
                <motion.div
                    className="absolute top-[-20rem] right-[-20rem] h-96 w-96 rounded-full bg-gradient-to-tr from-blue-600 to-purple-700 opacity-20 blur-3xl"
                />
                <motion.div
                    className="absolute bottom-[-15rem] left-[-15rem] h-80 w-80 rounded-full bg-gradient-to-tr from-pink-600 to-red-700 opacity-25 blur-3xl"
                />

                {/* Главный стек с формой и результатами */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 w-full max-w-md rounded-3xl bg-white/5 border border-white/20 backdrop-blur-xl shadow-lg p-8"
                >
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 text-center">
                        Поиск пользователя Steam
                    </h1>

                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Введите SteamID или имя пользователя"
                        className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition mb-4"
                        autoFocus
                    />

                    {loading && <p className="text-center text-sm text-white/70 mb-4">Загрузка...</p>}
                    {error && <p className="text-center text-sm text-red-500 mb-4">{error}</p>}

                    {results.length > 0 && (
                        <ul className="max-h-80 overflow-hidden rounded-xl border border-white/25 bg-white/10 backdrop-blur-md shadow-inner">
                            {results.map(user => (
                                <motion.li
                                    key={user.steamId}
                                    className="flex cursor-pointer items-center gap-4 border-b border-white/10 px-4 py-3 text-white transition hover:bg-white/20"
                                    onClick={() => handleSelect(user.steamId)}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full border border-white/40" />
                                    <div>
                                        <p className="font-semibold">{user.name}</p>
                                        <p className="text-xs text-white/70">{user.steamId}</p>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    )}

                    {!loading && query.length >= 3 && results.length === 0 && (
                        <p className="text-center text-sm text-white/60 italic mt-4">Ничего не найдено</p>
                    )}
                </motion.div>
            </div>
        </AppLayout>
    );
}
