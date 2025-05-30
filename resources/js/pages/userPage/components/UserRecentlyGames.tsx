import { motion } from 'framer-motion';

export const UserRecentlyGames = ({ userRecentlyGames }) => {
    return (
        <div className="rounded-xl border border-[#66C0F4]/20 bg-[#1B2838]/50 p-6">
            <h2 className="mb-4 text-xl font-bold text-[#66C0F4]">Недавно сыгранные игры ({userRecentlyGames.total_count})</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                {userRecentlyGames.games.map((game) => (
                    <div
                        key={game.appid}
                        className="cursor-pointer rounded-lg border border-[#66C0F4]/10 bg-[#0E1621]/70 p-4 transition-all hover:bg-[#0E1621]"
                    >
                        <div className="flex items-center gap-4">
                            <motion.div
                                whileHover={{ rotate: 5 }}
                                className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#66C0F4]/20 to-[#1B2838]"
                            >
                                <img
                                    className="h-16 w-16 rounded-lg"
                                    src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/library_600x900.jpg`}
                                    onError={(e) => {
                                        e.currentTarget.src = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
                                        e.currentTarget.className = 'h-40 w-full object-cover rounded-lg';
                                    }}
                                    alt={game.name}
                                />
                            </motion.div>
                            <div>
                                <h3 className="font-medium">{game.name}</h3>
                                <p className="text-sm text-[#C7D5E0]">{Math.floor(game.playtime_2weeks / 60)} hours last 2 weeks</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
