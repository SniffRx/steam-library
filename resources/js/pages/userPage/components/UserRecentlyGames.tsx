import { motion } from 'framer-motion';
import { Clock, Gamepad2 } from 'lucide-react';

export const UserRecentlyGames = ({ userRecentlyGames }) => {

    const games = userRecentlyGames?.games ?? [];
    const totalCount = userRecentlyGames?.total_count ?? 0;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-white/20 hover:shadow-xl hover:shadow-white/5">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            <div className="relative mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-600/20 p-2.5 shadow-lg shadow-blue-500/20">
                        <Gamepad2 className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-xl font-bold text-transparent">Недавно сыгранные</h2>
                        <p className="text-sm text-gray-400">{totalCount} игр</p>
                    </div>
                </div>
            </div>

            <div className="relative space-y-3">
                {games.length === 0 ? (
                    <p className="text-gray-500 italic">Нет недавно сыгранных игр</p>
                ) : (
                    games.map((game, index) => (
                    <motion.div key={game.appid} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + index * 0.05 }} whileHover={{ scale: 1.01, x: 4 }} className="group/game relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-r from-white/5 to-white/[0.02] p-4 backdrop-blur-sm transition-all hover:border-white/10 hover:shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover/game:opacity-100" />

                        <div className="relative flex items-center gap-4">
                            <motion.div whileHover={{ rotate: 2, scale: 1.05 }} className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
                                <img className="h-full w-full object-cover" src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/library_600x900.jpg`} onError={(e) => {
                                    e.currentTarget.src = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
                                }} alt={game.name} loading="lazy" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </motion.div>

                            <div className="flex-1 min-w-0">
                                <h3 className="truncate font-semibold text-white">{game.name}</h3>
                                <div className="mt-1 flex items-center gap-2 text-sm text-gray-400">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{Math.floor(game.playtime_2weeks / 60)} часов за 2 недели</span>
                                </div>
                            </div>

                            <div className="rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-600/20 px-3 py-1.5 text-xs font-semibold text-blue-400 shadow-lg shadow-blue-500/20">
                                {Math.floor(game.playtime_forever / 60)}ч
                            </div>
                        </div>
                    </motion.div>
                )))}
            </div>
        </motion.div>
    );
};

export default UserRecentlyGames;
