import { motion } from 'framer-motion';
import { Gamepad2, Clock } from 'lucide-react';

export const UserRecentlyGames = ({ userRecentlyGames }) => {
    const games = userRecentlyGames?.games ?? [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1a1f29]/60 backdrop-blur-xl rounded-2xl p-6 border border-white/5"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                    <Gamepad2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Недавно сыгранные</h3>
                    <p className="text-sm text-slate-400">{games.length} игр</p>
                </div>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {games.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">Нет недавно сыгранных игр</p>
                ) : (
                    games.map((game, i) => (
                        <motion.div
                            key={game.appid}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + i * 0.05 }}
                            className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/40 border border-white/5 hover:border-blue-400/30 transition-all"
                        >
                            <img
                                src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/library_600x900.jpg`}
                                alt={game.name}
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-white truncate">{game.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Clock className="w-3 h-3" />
                                    <span>{Math.floor(game.playtime_2weeks / 60)}ч за 2 недели</span>
                                </div>
                            </div>
                            <div className="text-sm font-semibold text-blue-400">
                                {Math.floor(game.playtime_forever / 60)}ч
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default UserRecentlyGames;
