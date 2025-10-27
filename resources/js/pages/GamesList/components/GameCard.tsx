import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Play, Clock } from 'lucide-react';

interface GameCardProps {
    game: any;
    isCompleted: boolean;
    onCompletionToggle: (id: number) => void;
    onGameSelect: (game: any) => void;
}

export const GameCard = React.memo(({ game, isCompleted, onCompletionToggle, onGameSelect }: GameCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            onClick={() => onGameSelect(game)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:border-white/20 hover:shadow-xl hover:shadow-white/5"
        >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

            {/* Image */}
            <div className="relative aspect-[16/9] overflow-hidden">
                <img
                    src={`https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                    alt={game.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Completion badge */}
                {isCompleted && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 p-1.5 shadow-lg shadow-emerald-500/50"
                    >
                        <CheckCircle2 className="h-4 w-4 text-white" />
                    </motion.div>
                )}

                {/* Playtime badge */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-lg bg-black/50 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    <Clock className="h-3 w-3" />
                    <span>{Math.floor(game.playtime_forever / 60)} ч</span>
                </div>
            </div>

            {/* Content */}
            <div className="relative p-4">
                {/* Title */}
                <h3 className="mb-3 line-clamp-2 text-base font-semibold text-white group-hover:text-gray-100">
                    {game.name}
                </h3>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Completion Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onCompletionToggle(game.appid);
                        }}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                            isCompleted
                                ? 'bg-gradient-to-r from-emerald-500/20 to-green-600/20 text-emerald-400 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        {isCompleted ? (
                            <>
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Пройдено</span>
                            </>
                        ) : (
                            <>
                                <Circle className="h-4 w-4" />
                                <span>Отметить</span>
                            </>
                        )}
                    </motion.button>

                    {/* Play Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `steam://run/${game.appid}`;
                        }}
                        className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 p-2.5 text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40"
                        title="Играть"
                    >
                        <Play className="h-4 w-4" fill="currentColor" />
                    </motion.button>
                </div>
            </div>

            {/* Recent play indicator */}
            {game.playtime_2weeks && game.playtime_2weeks > 0 && (
                <div className="absolute top-2 left-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-600/20 px-2 py-1 text-xs font-semibold text-amber-400 shadow-lg shadow-amber-500/20 backdrop-blur-sm">
                    Недавно играли
                </div>
            )}
        </motion.div>
    );
});

GameCard.displayName = 'GameCard';

export default GameCard;
