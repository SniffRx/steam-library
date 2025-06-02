import React, { useState, useEffect, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import GameCard from './components/GameCard';
import MiniGameCard from './components/MiniGameCard';
import GameDetailsView from './components/gameDetailsView/GameDetailsView';
import { motion } from 'framer-motion';

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

interface Props {
    games: Game[];
    friends: Friend[];
    completedGames: number[];
    error?: string;
}

export default function GamesList() {
    const { games: initialGames, friends, completedGames, error } = usePage<Props>().props;

    const [localCompleted, setLocalCompleted] = useState<number[]>(completedGames);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [gameDetails, setGameDetails] = useState<{
        achievements: Achievement[];
        friendsPlaying: Friend[];
    } | null>(null);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        sort: 'recent'
    });
    const [searchInput, setSearchInput] = useState(filters.search);
    const [loading, setLoading] = useState(false);

    // Кэширование данных о деталях игр
    const [detailsCache, setDetailsCache] = useState<Record<number, any>>({});

    // Фильтрация и сортировка
    const filteredGames = useMemo(() => {
        if (!initialGames.length) return [];

        let result = [...initialGames];

        // Поиск
        if (searchInput) {
            const lowerSearch = searchInput.toLowerCase();
            result = result.filter(game =>
                game.name.toLowerCase().includes(lowerSearch)
            );
        }

        // Статус
        if (filters.status === 'completed') {
            result = result.filter(game => localCompleted.includes(game.appid));
        } else if (filters.status === 'in-progress') {
            result = result.filter(game => !localCompleted.includes(game.appid));
        }

        // Сортировка
        result.sort((a, b) => {
            if (filters.sort === 'playtime') {
                return b.playtime_forever - a.playtime_forever;
            } else if (filters.sort === 'name') {
                return a.name.localeCompare(b.name);
            } else {
                return (b.playtime_2weeks || 0) - (a.playtime_2weeks || 0);
            }
        });

        return result;
    }, [initialGames, searchInput, filters, localCompleted]);

    // Дебаунс для поиска
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: searchInput }));
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleFilterChange = (newFilters: Partial<typeof filters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleCompletionToggle = async (gameId: number) => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const fetchGameDetails = async (game: Game) => {
        setSelectedGame(game);

        if (detailsCache[game.appid]) {
            setGameDetails(detailsCache[game.appid]);
            return;
        }

        setLoading(true);
        try {
            const [achievementsRes, friendsRes] = await Promise.all([
                fetch(`/steam/game/${game.appid}/details`),
                fetch(`/steam/game/${game.appid}/friends`)
            ]);

            if (!achievementsRes.ok || !friendsRes.ok) {
                throw new Error('Failed to load game details');
            }

            const data = await achievementsRes.json(); // Это уже содержит и achievements, и game_info
            const friendsData = await friendsRes.json();

            const details = {
                achievements: data.achievements || [],
                game_info: data.game_info || {},
                friendsPlaying: friendsData.friendsPlaying || []
            };

            setGameDetails(details);
            setDetailsCache(prev => ({ ...prev, [game.appid]: details }));
        } catch (err) {
            console.error('Failed to load full game details:', err);
            setGameDetails({
                achievements: [],
                game_info: {},
                friendsPlaying: []
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseDetails = () => {
        setSelectedGame(null);
        setGameDetails(null);
    };

    return (
        <AppLayout>
            <Head title="Games List" />
            <div className="max-w-screen-2xl mx-auto px-4 py-6">
                {/* Хедер */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">My Game Library</h1>
                    <div className="flex items-center space-x-4 text-gray-400">
                        <span>Total games: {initialGames.length}</span>
                        <span>•</span>
                        <span>Friends online: {friends.length}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Левая колонка: Filters */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 rounded-lg p-4 sticky top-4">
                            <h2 className="text-xl font-semibold text-white mb-4">Filters</h2>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Game name..."
                                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 pl-4 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                    />
                                    <svg
                                        className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-md font-medium text-gray-300 mb-3">Sort By</h3>
                                <select
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 text-white"
                                    onChange={(e) =>
                                        handleFilterChange({
                                            sort: e.target.value === 'Alphabetical' ? 'name' : e.target.value === 'Play Time' ? 'playtime' : 'recent'
                                        })
                                    }
                                    value={
                                        filters.sort === 'name'
                                            ? 'Alphabetical'
                                            : filters.sort === 'playtime'
                                                ? 'Play Time'
                                                : 'Recently Played'
                                    }
                                >
                                    <option>Recently Played</option>
                                    <option>Alphabetical</option>
                                    <option>Play Time</option>
                                </select>

                                <h3 className="text-md font-medium text-gray-300 mb-3">Status</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="status"
                                            checked={filters.status === 'all'}
                                            onChange={() => handleFilterChange({ status: 'all' })}
                                            className="form-radio h-5 w-5 text-blue-600"
                                        />
                                        <span className="text-gray-300">All</span>
                                    </label>
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="status"
                                            checked={filters.status === 'completed'}
                                            onChange={() => handleFilterChange({ status: 'completed' })}
                                            className="form-radio h-5 w-5 text-blue-600"
                                        />
                                        <span className="text-gray-300">Completed</span>
                                    </label>
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="status"
                                            checked={filters.status === 'in-progress'}
                                            onChange={() => handleFilterChange({ status: 'in-progress' })}
                                            className="form-radio h-5 w-5 text-blue-600"
                                        />
                                        <span className="text-gray-300">In Progress</span>
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-700">
                                <h3 className="font-medium text-white mb-3">Quick Stats</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Completed:</span>
                                        <span>{localCompleted.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">In Progress:</span>
                                        <span>{initialGames.length - localCompleted.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Мини-список "My Games", если выбрана игра */}
                        {selectedGame && (
                            <div className="sticky top-140 mt-6">
                                <div className="bg-gray-800/80 rounded-xl p-6 border border-gray-700">
                                    <h2 className="text-xl font-bold text-white mb-4">
                                        Selected Game
                                    </h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        <MiniGameCard
                                            game={selectedGame}
                                            isCompleted={localCompleted.includes(selectedGame.appid)}
                                            onGameSelect={() => fetchGameDetails(selectedGame)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Основное содержимое */}
                    {!selectedGame ? (
                        <div className="lg:col-span-4">
                            {error ? (
                                <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6 text-red-300">
                                    {error}
                                </div>
                            ) : initialGames.length === 0 ? (
                                <div className="text-center text-gray-400">No games found.</div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Блок "My Games" */}
                                    <div className="bg-gray-800/80 rounded-xl p-6 shadow-lg border border-gray-700">
                                        <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                                            <div className="flex justify-between items-center">
                                                <h2 className="text-xl font-bold text-white">
                                                    My Games{' '}
                                                    <span className="text-gray-400 text-sm">({filteredGames.length})</span>
                                                </h2>
                                                <div className="text-sm text-gray-400">
                                                    <span className="text-green-500">{localCompleted.length} completed</span>
                                                    {' • '}
                                                    <span>{filteredGames.length - localCompleted.length} remaining</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Грид игр */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {filteredGames.map(game => (
                                                <GameCard
                                                    key={game.appid}
                                                    game={game}
                                                    isCompleted={localCompleted.includes(game.appid)}
                                                    onCompletionToggle={() => handleCompletionToggle(game.appid)}
                                                    onGameSelect={() => fetchGameDetails(game)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            className="lg:col-span-4"
                        >
                            <GameDetailsView
                                game={selectedGame}
                                details={{
                                    achievements: gameDetails?.achievements || [],
                                    friendsPlaying: gameDetails?.friendsPlaying || [],
                                    game_info: gameDetails?.game_info || {}
                                }}
                                loading={loading}
                                onClose={handleCloseDetails}
                            />
                        </motion.div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
