import { useState, useEffect, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import GameCard from './components/GameCard';
import MiniGameCard from './components/MiniGameCard';
import GameDetailsView from './components/gameDetailsView/GameDetailsView';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, RefreshCw, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

// ✨ НОВЫЕ ИМПОРТЫ
import { useSyncProgress } from '@/hooks/useSyncProgress';
import { useGameDetails } from '@/hooks/useGameDetails';

interface Game {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
    playtime_2weeks?: number;
}

interface Friend {
    steamid: string;
    personaname: string;
    avatar: string;
    gameextrainfo?: string;
}

interface Achievement {
    apiname: string;
    achieved: boolean;
    unlocktime: number;
    name?: string;
    description?: string;
    icon?: string;
}

interface SyncProgress {
    status: 'idle' | 'queued' | 'processing' | 'completed' | 'error';
    progress?: number;
    processed?: number;
    total?: number;
    completed?: number;
    errors?: number;
    message?: string;
    finished_at?: string;
}

interface Props {
    games: Game[];
    friends: Friend[];
    completedGames: number[];
    error?: string;
    initialSync?: boolean;
    syncInProgress?: boolean;
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
    const [visibleCount, setVisibleCount] = useState(9);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // ✨ React Query для синхронизации
    const { data: syncProgress } = useSyncProgress(syncing);

    // ✨ React Query для деталей игры
    const { data: gameDetails, isLoading: isLoadingDetails } = useGameDetails(selectedGameId);

    // ✨ Отслеживаем завершение синхронизации
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
                        setVisibleCount(prev => Math.min(prev + 9, filteredGames.length));
                        setIsLoadingMore(false);
                    }, 300);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoadingMore, visibleCount]);

    // Сброс при изменении фильтров
    useEffect(() => {
        setVisibleCount(9);
    }, [filters, searchInput]);

    // ✨ Оптимизированная фильтрация с Set
    const filteredGames = useMemo(() => {
        if (!initialGames.length) return [];

        const completedSet = new Set(localCompleted);
        let result = initialGames;

        // Фильтрация по поиску
        if (searchInput) {
            const lowerSearch = searchInput.toLowerCase();
            result = result.filter(game =>
                game.name.toLowerCase().includes(lowerSearch)
            );
        }

        // Фильтрация по статусу
        if (filters.status === 'completed') {
            result = result.filter(game => completedSet.has(game.appid));
        } else if (filters.status === 'in-progress') {
            result = result.filter(game => !completedSet.has(game.appid));
        }

        // Сортировка
        return [...result].sort((a, b) => {
            if (filters.sort === 'playtime') {
                return b.playtime_forever - a.playtime_forever;
            }
            if (filters.sort === 'name') {
                return a.name.localeCompare(b.name);
            }
            return (b.playtime_2weeks || 0) - (a.playtime_2weeks || 0);
        });
    }, [initialGames, searchInput, filters.status, filters.sort, localCompleted]);

    // Видимые игры для infinite scroll
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

            if (!response.ok) throw new Error('Failed to start sync');
            const data = await response.json();

            if (data.message === 'Sync started' || data.message === 'Sync already in progress') {
                setSyncing(true);
            }
        } catch (error) {
            console.error('Failed to start sync:', error);
        }
    };

    // Изменение фильтров
    const handleFilterChange = (newFilters: Partial<typeof filters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    // Переключение завершённости игры
    const handleCompletionToggle = async (gameId: number) => {
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
    };

    // ✨ Выбор игры (использует React Query)
    const handleGameSelect = (game: Game) => {
        setSelectedGame(game);
        setSelectedGameId(game.appid);
    };

    // Закрытие деталей
    const handleCloseDetails = () => {
        setSelectedGame(null);
        setSelectedGameId(null);
    };

    // Если первая синхронизация - показываем загрузчик
    if (initialSync) {
        return (
            <AppLayout>
                <Head title="Games List" />

                <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-black to-gray-900" />
                <div className="fixed inset-0 -z-10 overflow-hidden">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"
                    />
                </div>

                <div className="relative px-4 md:px-6 lg:px-8 py-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl"
                    >
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent"
                        />

                        <h2 className="relative mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-2xl font-bold text-transparent">
                            Первая загрузка библиотеки
                        </h2>
                        <p className="relative mb-6 text-gray-400">
                            {message || 'Загружаем вашу библиотеку игр из Steam...'}
                        </p>
                        <p className="relative text-sm text-gray-500">
                            Это может занять несколько минут. Страница обновится автоматически.
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => window.location.reload()}
                            className="relative mt-6 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40"
                        >
                            Проверить статус
                        </motion.button>
                    </motion.div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Games List" />

            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-black to-gray-900" />
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white/5 blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/3 blur-3xl"
                />
            </div>

            <div className="relative space-y-6 px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
                {/* Основной layout */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                    {/* Левая колонка - Фильтры */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-1"
                    >
                        <div className="sticky top-4 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
                            <h2 className="text-xl font-bold text-white">Фильтры</h2>

                            {/* Поиск */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">Поиск</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Название игры..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 pr-10 text-white placeholder-gray-400 transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/50"
                                    />
                                    <Search className="absolute top-2.5 right-3 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Сортировка */}
                            <div>
                                <h3 className="mb-3 text-sm font-semibold text-gray-300">Сортировка</h3>
                                <select
                                    value={filters.sort === 'name' ? 'Alphabetical' : filters.sort === 'playtime' ? 'Play Time' : 'Recent'}
                                    onChange={(e) =>
                                        handleFilterChange({
                                            sort: e.target.value === 'Alphabetical' ? 'name' : e.target.value === 'Play Time' ? 'playtime' : 'recent',
                                        })
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/50"
                                >
                                    <option>Recent</option>
                                    <option>Alphabetical</option>
                                    <option>Play Time</option>
                                </select>
                            </div>

                            {/* Статус */}
                            <div>
                                <h3 className="mb-3 text-sm font-semibold text-gray-300">Статус</h3>
                                <div className="space-y-3">
                                    {[
                                        { key: 'all', label: 'Все' },
                                        { key: 'completed', label: 'Пройдено' },
                                        { key: 'in-progress', label: 'В процессе' },
                                    ].map(({ key, label }) => (
                                        <label key={key} className="group flex cursor-pointer items-center space-x-3">
                                            <input
                                                type="radio"
                                                checked={filters.status === key}
                                                onChange={() => handleFilterChange({ status: key })}
                                                className="h-5 w-5 border-gray-400 bg-transparent text-blue-500 focus:ring-2 focus:ring-blue-400"
                                            />
                                            <span className="text-gray-200 transition-colors group-hover:text-white">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="border-t border-white/10 pt-4">
                                <h3 className="mb-3 font-semibold text-white">Статистика</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Завершено:</span>
                                        <span className="font-semibold text-emerald-400">{localCompleted.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">В процессе:</span>
                                        <span className="font-semibold text-blue-400">{initialGames.length - localCompleted.length}</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(localCompleted.length / initialGames.length) * 100}%` }}
                                            transition={{ duration: 1 }}
                                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600"
                                        />
                                    </div>
                                    <p className="text-center text-xs text-gray-500">
                                        {Math.round((localCompleted.length / initialGames.length) * 100)}% завершено
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Правая колонка - Контент */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Заголовок + кнопка синхронизации */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl"
                        >
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                            <div className="relative flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                                <div>
                                    <h1 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-2xl font-bold text-transparent">
                                        Моя библиотека игр
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-400">
                                        Всего: {initialGames.length} | Друзья онлайн: {friends.length}
                                    </p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSyncAll}
                                    disabled={syncing}
                                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium text-white shadow-lg transition-all ${
                                        syncing
                                            ? 'cursor-not-allowed bg-gray-600'
                                            : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:shadow-blue-500/30'
                                    }`}
                                >
                                    {syncing ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                            <span>Синхронизация...</span>
                                        </>
                                    ) : (
                                        <>
                                            <TrendingUp className="h-4 w-4" />
                                            <span>Проверить все игры</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>

                            {/* Прогресс-бар */}
                            <AnimatePresence>
                                {syncing && syncProgress?.status !== 'idle' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                                            <div className="mb-2 flex justify-between text-sm text-gray-300">
                                                <span>
                                                    {syncProgress?.status === 'queued' && 'В очереди...'}
                                                    {syncProgress?.status === 'processing' &&
                                                        `Обработка (${syncProgress?.processed}/${syncProgress?.total})`}
                                                    {syncProgress?.status === 'completed' && 'Завершено!'}
                                                    {syncProgress?.status === 'error' && 'Ошибка'}
                                                </span>
                                                <span className="font-semibold">{syncProgress?.progress ?? 0}%</span>
                                            </div>

                                            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                                                <motion.div
                                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-600"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${syncProgress?.progress ?? 0}%` }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </div>

                                            {syncProgress?.status === 'processing' && (
                                                <div className="mt-2 flex justify-between text-xs text-gray-400">
                                                    <span>Завершено: {syncProgress?.completed ?? 0}</span>
                                                    {syncProgress?.errors ? (
                                                        <span className="text-yellow-400">Ошибок: {syncProgress?.errors}</span>
                                                    ) : null}
                                                </div>
                                            )}

                                            {syncProgress?.status === 'completed' && (
                                                <p className="mt-2 text-sm text-emerald-400">
                                                    ✓ Найдено {syncProgress?.completed} из {syncProgress?.total}
                                                </p>
                                            )}

                                            {syncProgress?.status === 'error' && (
                                                <p className="mt-2 text-sm text-red-400">✗ {syncProgress?.message || 'Произошла ошибка'}</p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Список игр / Детали игры */}
                        <AnimatePresence mode="wait">
                            {!selectedGame ? (
                                <motion.div
                                    key="games-list"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl"
                                >
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                                    {/* Заголовок */}
                                    <div className="relative mb-6 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-white">
                                                Игры ({visibleCount} / {filteredGames.length})
                                            </h2>
                                            {visibleCount < filteredGames.length && (
                                                <p className="mt-1 text-xs text-gray-500">Прокрутите вниз для загрузки ещё</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                                <span>{localCompleted.length} завершено</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <span>{initialGames.length - localCompleted.length} в процессе</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Грид игр */}
                                    {error ? (
                                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">{error}</div>
                                    ) : initialGames.length === 0 ? (
                                        <div className="py-12 text-center text-gray-400">Игры не найдены</div>
                                    ) : (
                                        <>
                                            <div className="relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

                                            {/* Loading indicator */}
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
                                                    <span className="ml-3 text-gray-400">Загрузка игр...</span>
                                                </motion.div>
                                            )}

                                            {/* End indicator */}
                                            {visibleCount >= filteredGames.length && filteredGames.length > 9 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-center py-6 text-gray-500 text-sm"
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
        </AppLayout>
    );
}
