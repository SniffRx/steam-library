import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Play, Clock, TrendingUp } from 'lucide-react';

interface GameCardProps {
    game: any;
    isCompleted: boolean;
    onCompletionToggle: (id: number) => void;
    onGameSelect: (game: any) => void;
}

export const GameCard = React.memo(({ game, isCompleted, onCompletionToggle, onGameSelect }: GameCardProps) => {
    const hours = Math.floor(game.playtime_forever / 60);
    const hasRecentPlay = game.playtime_2weeks && game.playtime_2weeks > 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => onGameSelect(game)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-sm shadow-lg hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all"
        >
            {/* Hover gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

            {/* Image Container */}
            <div className="relative aspect-[16/9] overflow-hidden">
                <img
                    src={`https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                    alt={game.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.currentTarget.src = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
                    }}
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                {/* Completion Badge */}
                {isCompleted && (
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/50 border-2 border-white/20"
                    >
                        <CheckCircle2 className="w-5 h-5 text-white" />
                    </motion.div>
                )}

                {/* Recent Play Indicator */}
                {hasRecentPlay && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-md text-xs font-semibold text-white shadow-lg">
                        <TrendingUp className="w-3 h-3" />
                        <span>Недавно</span>
                    </div>
                )}

                {/* Playtime Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-300">
                    <Clock className="w-3 h-3" />
                    <span>{hours}ч</span>
                </div>
            </div>

            {/* Content */}
            <div className="relative p-4">
                {/* Title */}
                <h3 className="mb-3 text-base font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors min-h-[3rem]">
                    {game.name}
                </h3>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {/* Completion Toggle Button */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onCompletionToggle(game.appid);
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            isCompleted
                                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 shadow-lg shadow-green-500/10'
                                : 'bg-slate-800/50 border border-white/5 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-blue-400/30'
                        }`}
                    >
                        {isCompleted ? (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Пройдено</span>
                            </>
                        ) : (
                            <>
                                <Circle className="w-4 h-4" />
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
                        className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
                        title="Запустить игру"
                    >
                        <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
});

GameCard.displayName = 'GameCard';

export default GameCard;
