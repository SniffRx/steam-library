import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import GameCard from './Components/GameCard';
import EnhancedGameDetailsView from './Components/EnhancedGameDetailsView';
import { Game, GameDetails, PageProps } from './Types/GameTypes';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Games List', href: '/gameslist' }
];

export default function Gameslist({ completedGames }: { completedGames: number[] }) {
    const { games, friends, error } = usePage<PageProps>().props;
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [localCompleted, setLocalCompleted] = useState<number[]>(completedGames);
    const [sortOption, setSortOption] = useState<'time' | 'name' | 'completed'>('time');

    // Функция для отправки на сервер
    const handleCompletionToggle = async (gameId: number) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        try {
            const res = await fetch(`/gameslist/${gameId}/toggle-completion`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include', // важно для Laravel сессии
                body: JSON.stringify({})
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();

            if (data.is_completed !== undefined) {
                setLocalCompleted(prev =>
                    data.is_completed
                        ? [...prev, gameId]
                        : prev.filter(id => id !== gameId)
                );
            }
        } catch (err) {
            console.error('Ошибка при отметке как завершённого:', err);
        }
    };

// Автоматическое завершение по достижениям
    useEffect(() => {
        if (!selectedGame || !gameDetails) return;

        const totalAchievements = gameDetails.achievements?.length || 0;
        const unlockedCount = gameDetails.achievements?.filter(a => a.achieved).length || 0;

        if (
            totalAchievements > 0 &&
            unlockedCount === totalAchievements &&
            !localCompleted.includes(selectedGame?.appid)
        ) {
            handleCompletionToggle(selectedGame.appid);
        }
    }, [gameDetails, selectedGame]);

    const handleGameSelect = async (game: Game) => {
        setSelectedGame(game);
        setLoadingDetails(true);
        try {
            const response = await fetch(`/steam/game/${game.appid}`, {
                credentials: 'include',
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch game details');

            const contentType = response.headers.get('Content-Type');
            if (!contentType?.includes('application/json')) {
                const errorText = await response.text();
                throw new Error(`Invalid JSON response: ${errorText}`);
            }

            const details: GameDetails = await response.json();

            const gameFriends = friends.filter(f => f.gameid === game.appid.toString());

            if (!Array.isArray(details.achievements)) {
                details.achievements = [];
            }

            // Загружаем статус завершённости
            const completionRes = await fetch(`/gameslist/${game.appid}/completion-status`);
            const completionData = await completionRes.json();

            if (completionData.is_completed) {
                setLocalCompleted(prev => [...prev, game.appid]);
            }

            setGameDetails({
                ...details,
                friends: gameFriends
            });

            // Автоматическая пометка завершения при полной разблокировке достижений
            if (
                details.achievements &&
                details.achievements.length > 0 &&
                details.achievements.every(a => a.achieved) &&
                !localCompleted.includes(game.appid)
            ) {
                await handleCompletionToggle(game.appid);
            }

        } catch (err) {
            console.error('Error loading game details:', err);
        } finally {
            setLoadingDetails(false);
        }
    };

    // Фильтрация по названию игры
    const filteredByName = games.filter(game =>
        game.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Сортировка
    const sortedGames = [...filteredByName].sort((a, b) => {
        if (sortOption === 'time') {
            return b.playtime_forever - a.playtime_forever;
        } else if (sortOption === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortOption === 'completed') {
            const aCompleted = localCompleted.includes(a.appid) ? 1 : 0;
            const bCompleted = localCompleted.includes(b.appid) ? 1 : 0;
            return bCompleted - aCompleted || a.name.localeCompare(b.name); // completed first, then by name
        }
        return 0;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Games List" />
            <div className="max-w-8xl mx-auto px-4 py-6">
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Фильтры и сортировка */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">


                    {/* Категории */}
                    {/*{availableCategories.length > 0 && (*/}
                    {/*    <div className="flex items-center gap-2">*/}
                    {/*        <label htmlFor="category-filter" className="text-sm text-gray-400 min-w-[70px]">Genre:</label>*/}
                    {/*        <select*/}
                    {/*            id="category-filter"*/}
                    {/*            value={filterCategory}*/}
                    {/*            onChange={(e) => setFilterCategory(e.target.value)}*/}
                    {/*            className="bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-4 text-white w-full"*/}
                    {/*        >*/}
                    {/*            <option value="all">All</option>*/}
                    {/*            {availableCategories.map((cat, idx) => (*/}
                    {/*                <option key={idx} value={cat}>{cat}</option>*/}
                    {/*            ))}*/}
                    {/*        </select>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>

                {/* Основной контент */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Левая колонка - список игр */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800/50 rounded-xl shadow-lg p-6">
                            {/* Поиск и сортировка */}
                            <div className="mb-6 flex justify-end gap-4 items-center">
                                <div className="relative w-full max-w-xs">
                                    <input
                                        type="text"
                                        placeholder="Search by name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 pl-4 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <svg
                                        className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>

                                {/* Выпадающий список для сортировки */}
                                <div className="flex items-center gap-2 min-w-[180px]">
                                    <label htmlFor="sort-select" className="text-sm text-gray-400 whitespace-nowrap">Sort
                                        by:</label>
                                    <select
                                        id="sort-select"
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value as 'time' | 'name')}
                                        className="bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 text-white w-full"
                                    >
                                        <option value="time">Time Played</option>
                                        <option value="completed">Completed First</option>
                                        <option value="name">Name (A → Z)</option>
                                    </select>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-6">Your Games ({sortedGames.length})</h2>
                            <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                                {sortedGames.map(game => (
                                    <GameCard
                                        key={game.appid}
                                        game={game}
                                        isSelected={selectedGame?.appid === game.appid}
                                        isCompleted={localCompleted.includes(game.appid)}
                                        onSelect={() => handleGameSelect(game)}
                                        onCompletion={() => handleCompletionToggle(game.appid)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка - детали */}
                    <div className="lg:col-span-2">
                        {loadingDetails ? (
                            <div
                                className="bg-gray-800/50 rounded-xl shadow-lg p-6 flex items-center justify-center h-[600px]">
                                <div
                                    className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : selectedGame ? (
                            <EnhancedGameDetailsView
                                game={selectedGame}
                                details={gameDetails}
                                isCompleted={localCompleted.includes(selectedGame.appid)}
                                onCompletion={() => handleCompletionToggle(selectedGame.appid)}
                            />
                        ) : (
                            <div
                                className="bg-gray-800/50 rounded-xl shadow-lg p-6 flex items-center justify-center h-64">
                                <div className="text-center text-gray-400">
                                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0 -3.332.477 -4.5 1.253" />
                                    </svg>
                                    <p className="mt-2">Select a game to view details</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
