import { useState, useEffect, useMemo, useCallback } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import GameCard from './components/GameCard';
import GameDetailsView from './components/gameDetailsView/GameDetailsView';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, RefreshCw, TrendingUp, CheckCircle2, Clock, Filter } from 'lucide-react';

// Hooks
import { useSyncProgress } from '@/hooks/useSyncProgress';
import { useGameDetails } from '@/hooks/useGameDetails';

interface Game {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
    playtime_2weeks?: number;
}

interface Props {
    games: Game[];
    friends: any[];
    completedGames: number[];
    error?: string;
    initialSync?: boolean;
    message?: string;
}

export default function GamesList() {
    const { games: initialGames, friends, completedGames, error, initialSync, message } = usePage<Props>().props;

    // State
    const [localCompleted, setLocalCompleted] = useState<number[]>(completedGames);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
    const [filters, setFilters] = useState({ search: '', status: 'all', sort: 'recent' });
    const [searchInput, setSearchInput] = useState(filters.search);
    const [syncing, setSyncing] = useState(false);
    const [visibleCount, setVisibleCount] = useState(() => Math.min(12, initialGames.length));
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // React Query hooks
    const { data: syncProgress } = useSyncProgress(syncing);
    const { data: gameDetails, isLoading: isLoadingDetails } = useGameDetails(selectedGameId);

    // Отслеживаем завершение синхронизации
    useEffect(() => {
        if (!syncProgress) return;

        if (syncProgress.status === 'completed' || syncProgress.status === 'error' || syncProgress.status === 'idle') {
            setSyncing(false);
            if (syncProgress.status === 'completed') {
                setTimeout(() => window.location.reload(), 2000);
            }
        }
    }, [syncProgress]);

    // Дебаунс для поиска
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: searchInput }));
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= documentHeight - 300) {
                if (!isLoadingMore && visibleCount < filteredGames.length) {
                    setIsLoadingMore(true);
                    setTimeout(() => {
                        setVisibleCount(prev => Math.min(prev + 12, filteredGames.length));
                        setIsLoadingMore(false);
                    }, 300);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoadingMore, visibleCount]);

    // Фильтрация игр
    const filteredGames = useMemo(() => {
        if (!initialGames.length) return [];

        const completedSet = new Set(localCompleted);
        let result = initialGames;

        if (searchInput) {
            const lowerSearch = searchInput.toLowerCase();
            result = result.filter(game => game.name.toLowerCase().includes(lowerSearch));
        }

        if (filters.status === 'completed') {
            result = result.filter(game => completedSet.has(game.appid));
        } else if (filters.status === 'in-progress') {
            result = result.filter(game => !completedSet.has(game.appid));
        }

        return [...result].sort((a, b) => {
            if (filters.sort === 'playtime') return b.playtime_forever - a.playtime_forever;
            if (filters.sort === 'name') return a.name.localeCompare(b.name);
            return (b.playtime_2weeks || 0) - (a.playtime_2weeks || 0);
        });
    }, [initialGames, searchInput, filters.status, filters.sort, localCompleted]);

    // Сброс при изменении фильтров
    useEffect(() => {
        setVisibleCount(Math.min(12, filteredGames.length));
    }, [filters, searchInput, filteredGames.length]);

    const visibleGames = useMemo(() => {
        return filteredGames.slice(0, visibleCount);
    }, [filteredGames, visibleCount]);

    // Запуск синхронизации
    const handleSyncAll = async () => {
        try {
            const response = await fetch('/gameslist/sync-all', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });

            if (response.status === 429) {
                const data = await response.json();
                alert(`Синхронизация разрешена не чаще одного раза в 24 часа.\nПоследний запуск: ${data.last_sync}`);
                return;
            }

            if (!response.ok) throw new Error('Failed to start sync');
            const data = await response.json();

            if (data.message === 'Sync started' || data.message === 'Sync already in progress') {
                setSyncing(true);
            }
        } catch (error) {
            console.error('Failed to start sync:', error);
        }
    };

    const handleFilterChange = useCallback((newFilters: Partial<typeof filters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const handleCompletionToggle = useCallback(async (gameId: number) => {
        try {
            const response = await fetch(`/gameslist/${gameId}/toggle-completion`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to toggle completion');
            const data = await response.json();

            setLocalCompleted(prev =>
                data.is_completed ? [...prev, gameId] : prev.filter(id => id !== gameId)
            );
        } catch (err) {
            console.error('Error toggling completion:', err);
        }
    }, []);

    const handleGameSelect = useCallback((game: Game) => {
        setSelectedGame(game);
        setSelectedGameId(game.appid);
    }, []);

    const handleCloseDetails = useCallback(() => {
        setSelectedGame(null);
        setSelectedGameId(null);
    }, []);

    // Первая синхронизация
    if (initialSync) {
        return (
            <AppLayout>
                <Head title="Загрузка игр - Steam Library" />

                <div className="min-h-screen bg-[#0e1217] relative overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>

                    <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-2xl w-full bg-[#1a1f29]/80 backdrop-blur-xl rounded-3xl p-12 border border-white/5 text-center"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent"
                            />

                            <h2 className="text-3xl font-bold mb-4 font-['Instrument_Sans'] bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                Первая загрузка библиотеки
                            </h2>
                            <p className="text-lg text-slate-400 mb-6">
                                {message || 'Загружаем вашу библиотеку игр из Steam...'}
                            </p>
                            <p className="text-sm text-slate-500">
                                Это может занять несколько минут. Страница обновится автоматически.
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.reload()}
                                className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                            >
                                Проверить статус
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Библиотека игр - Steam Library" />

            <div className="min-h-screen bg-[#0e1217] relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#1a1f29]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl"
                    >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold font-['Instrument_Sans'] bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                                    Моя библиотека игр
                                </h1>
                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                    <span>Всего: {initialGames.length}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        {localCompleted.length} завершено
                                    </span>
                                    <span>•</span>
                                    <span>Друзей онлайн: {friends.length}</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSyncAll}
                                disabled={syncing}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all ${
                                    syncing
                                        ? 'bg-slate-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-blue-500/30'
                                } text-white`}
                            >
                                {syncing ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        <span>Синхронизация...</span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingUp className="w-5 h-5" />
                                        <span>Обновить данные</span>
                                    </>
                                )}
                            </motion.button>
                        </div>

                        {/* Progress Bar */}
                        <AnimatePresence>
                            {syncing && syncProgress?.status !== 'idle' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="bg-slate-900/40 border border-white/5 rounded-xl p-4"
                                >
                                    <div className="flex justify-between text-sm text-slate-300 mb-2">
                                        <span>
                                            {syncProgress?.status === 'queued' && 'В очереди...'}
                                            {syncProgress?.status === 'processing' && `Обработка (${syncProgress?.processed}/${syncProgress?.total})`}
                                            {syncProgress?.status === 'completed' && 'Завершено!'}
                                            {syncProgress?.status === 'error' && 'Ошибка'}
                                        </span>
                                        <span className="font-bold">{syncProgress?.progress ?? 0}%</span>
                                    </div>

                                    <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${syncProgress?.progress ?? 0}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>

                                    {syncProgress?.status === 'completed' && (
                                        <p className="mt-2 text-sm text-green-400">
                                            ✓ Найдено {syncProgress?.completed} из {syncProgress?.total}
                                        </p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Filters & Content */}
                    <div className="grid lg:grid-cols-4 gap-6">
                        {/* Sidebar Filters */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-1"
                        >
                            <div className="sticky top-6 bg-[#1a1f29]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl space-y-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Filter className="w-5 h-5 text-blue-400" />
                                    <h2 className="text-xl font-bold text-white">Фильтры</h2>
                                </div>

                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Поиск</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Название игры..."
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        />
                                        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                    </div>
                                </div>

                                {/* Sort */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Сортировка</label>
                                    <select
                                        value={filters.sort}
                                        onChange={(e) => handleFilterChange({ sort: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-white/5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    >
                                        <option value="recent">Недавно играли</option>
                                        <option value="name">По алфавиту</option>
                                        <option value="playtime">По времени игры</option>
                                    </select>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-3">Статус</label>
                                    <div className="space-y-2">
                                        {[
                                            { key: 'all', label: 'Все игры' },
                                            { key: 'completed', label: 'Завершённые' },
                                            { key: 'in-progress', label: 'В процессе' }
                                        ].map(({ key, label }) => (
                                            <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    checked={filters.status === key}
                                                    onChange={() => handleFilterChange({ status: key })}
                                                    className="w-4 h-4 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                                                />
                                                <span className="text-slate-300 group-hover:text-white transition-colors">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="pt-6 border-t border-white/5">
                                    <h3 className="text-sm font-semibold text-white mb-3">Статистика</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Завершено:</span>
                                            <span className="font-semibold text-green-400">{localCompleted.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">В процессе:</span>
                                            <span className="font-semibold text-blue-400">{initialGames.length - localCompleted.length}</span>
                                        </div>
                                    </div>
                                    <div className="mt-3 h-2 bg-slate-900/50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(localCompleted.length / initialGames.length) * 100}%` }}
                                            transition={{ duration: 1 }}
                                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                        />
                                    </div>
                                    <p className="text-center text-xs text-slate-500 mt-2">
                                        {Math.round((localCompleted.length / initialGames.length) * 100)}% завершено
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Games Grid */}
                        <div className="lg:col-span-3">
                            <AnimatePresence mode="wait">
                                {!selectedGame ? (
                                    <motion.div
                                        key="games-grid"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-[#1a1f29]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h2 className="text-xl font-bold text-white">
                                                    Игры ({visibleCount} / {filteredGames.length})
                                                </h2>
                                                {visibleCount < filteredGames.length && (
                                                    <p className="text-xs text-slate-500 mt-1">Прокрутите вниз для загрузки ещё</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                                <div className="flex items-center gap-1">
                                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                    <span>{localCompleted.length}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4 text-slate-400" />
                                                    <span>{initialGames.length - localCompleted.length}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {error ? (
                                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">{error}</div>
                                        ) : initialGames.length === 0 ? (
                                            <div className="py-12 text-center text-slate-400">Игры не найдены</div>
                                        ) : (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                                    {visibleGames.map(game => (
                                                        <GameCard
                                                            key={game.appid}
                                                            game={game}
                                                            isCompleted={localCompleted.includes(game.appid)}
                                                            onCompletionToggle={() => handleCompletionToggle(game.appid)}
                                                            onGameSelect={() => handleGameSelect(game)}
                                                        />
                                                    ))}
                                                </div>

                                                {isLoadingMore && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="flex justify-center items-center py-8"
                                                    >
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                            className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent"
                                                        />
                                                        <span className="ml-3 text-slate-400">Загрузка игр...</span>
                                                    </motion.div>
                                                )}

                                                {visibleCount >= filteredGames.length && filteredGames.length > 12 && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="text-center py-6 text-slate-500 text-sm"
                                                    >
                                                        Показаны все игры ({filteredGames.length})
                                                    </motion.div>
                                                )}
                                            </>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="game-details"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <GameDetailsView
                                            game={selectedGame}
                                            loading={isLoadingDetails}
                                            details={gameDetails || {
                                                achievements: [],
                                                friendsPlaying: [],
                                                game_info: {},
                                            }}
                                            onClose={handleCloseDetails}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
