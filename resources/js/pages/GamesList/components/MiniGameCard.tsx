import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2 } from 'lucide-react';

interface MiniGameCardProps {
    game: {
        appid: number;
        name: string;
        playtime_forever: number;
        img_icon_url: string;
    };
    isCompleted: boolean;
    onGameSelect: () => void;
}

const MiniGameCard = React.memo(({ game, isCompleted, onGameSelect }: MiniGameCardProps) => {
    const hours = Math.floor(game.playtime_forever / 60);

    return (
        <motion.div
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGameSelect}
            className="relative overflow-hidden bg-slate-900/40 hover:bg-slate-900/60 border border-white/5 hover:border-blue-400/30 rounded-xl p-3 cursor-pointer transition-all duration-300 group"
        >
            <div className="flex items-center gap-3">
                {/* Game Image */}
                <div className="relative flex-shrink-0">
                    <img
                        src={`https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                        alt={game.name}
                        className="w-12 h-12 rounded-lg object-cover border border-white/10 group-hover:border-blue-400/30 transition-colors"
                        onError={(e) => {
                            e.currentTarget.src = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
                        }}
                    />
                    {isCompleted && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-slate-900">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                    )}
                </div>

                {/* Game Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                        {game.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{hours}ч</span>
                    </div>
                </div>

                {/* Arrow Icon */}
                <svg
                    className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </motion.div>
    );
});

MiniGameCard.displayName = 'MiniGameCard';

export default MiniGameCard;
