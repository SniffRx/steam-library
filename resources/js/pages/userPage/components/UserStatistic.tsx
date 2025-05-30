import { motion } from 'framer-motion';

export const UserStatistic = ({userGamesCount, userFriends, userRecentlyGames}) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-[#66C0F4]/20 bg-[#1B2838]/50 p-6"
        >
            <h2 className="mb-4 text-xl font-bold text-[#66C0F4]">Статистика</h2>
            <div className="grid grid-cols-2 gap-4">
                {[
                    { title: 'Количество игр', value: userGamesCount },
                    { title: 'Количество друзей', value: userFriends.total_friends },
                    { title: 'В списке желаемого', value: 'В разработке' },
                    {
                        title: 'Часов за 2 недели',
                        value: (userRecentlyGames.games.reduce((sum, game) => sum + game.playtime_2weeks, 0) / 60).toFixed(1),
                    },
                ].map((stat, index) => (
                    <div key={index} className="rounded-lg bg-[#0E1621]/70 p-3">
                        <p className="text-sm text-[#C7D5E0]">{stat.title}</p>
                        <p className="text-lg font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
