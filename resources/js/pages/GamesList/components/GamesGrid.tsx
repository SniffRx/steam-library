import { GameCard } from './GameCard';
import { motion } from 'framer-motion';
import { Gamepad2, CheckCircle2, Clock } from 'lucide-react';

interface Game {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
}

interface FriendsProps {
    steamid: string;
    personaname: string;
    avatar: string;
}

interface GamesGridProps {
    games: Game[];
    friends: FriendsProps[];
    completedGames: number[];
    onCompletionToggle: (gameId: number) => void;
    onGameSelect: (game: Game) => void;
}

export const GamesGrid = ({
                              games,
                              friends,
                              completedGames,
                              onCompletionToggle,
                              onGameSelect,
                          }: GamesGridProps) => {
    const completionPercentage = games.length > 0
        ? Math.round((completedGames.length / games.length) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#1a1f29]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl"
        >
            {/* Header */}
            <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-5 mb-6 border border-white/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <Gamepad2 className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                Мои игры
                                <span className="text-sm font-normal text-slate-400">({games.length})</span>
                            </h2>
                            <p className="text-sm text-slate-500">Ваша коллекция Steam</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-semibold text-green-400">
                                {completedGames.length} завершено
                            </span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-500/10 border border-slate-500/30">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-400">
                                {games.length - completedGames.length} в процессе
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-slate-400">Прогресс завершения</span>
                        <span className="text-xs font-bold text-white">{completionPercentage}%</span>
                    </div>
                    <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPercentage}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        />
                    </div>
                </div>
            </div>

            {/* Games Grid */}
            {games.length === 0 ? (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900/50 border border-white/5 mb-4">
                        <Gamepad2 className="w-8 h-8 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-400 mb-2">Игры не найдены</h3>
                    <p className="text-sm text-slate-500">Попробуйте изменить фильтры или обновить данные</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {games.map((game, index) => (
                        <motion.div
                            key={game.appid}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <GameCard
                                game={game}
                                friends={friends}
                                isCompleted={completedGames.includes(game.appid)}
                                onCompletionToggle={onCompletionToggle}
                                onGameSelect={onGameSelect}
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};
