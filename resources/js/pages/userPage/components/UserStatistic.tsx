import { motion } from 'framer-motion';
import { Gamepad2, Users, Clock, Heart } from 'lucide-react';

export const UserStatistic = ({ userGamesCount, userFriends, userRecentlyGames }) => {
    const stats = [
        {
            title: 'Количество игр',
            value: userGamesCount,
            icon: Gamepad2,
            gradient: 'from-blue-500/20 to-cyan-600/20',
            iconColor: 'text-blue-400',
            glow: 'shadow-blue-500/20'
        },
        {
            title: 'Количество друзей',
            value: userFriends.total_friends,
            icon: Users,
            gradient: 'from-purple-500/20 to-violet-600/20',
            iconColor: 'text-purple-400',
            glow: 'shadow-purple-500/20'
        },
        {
            title: 'В списке желаемого',
            value: 'В разработке',
            icon: Heart,
            gradient: 'from-pink-500/20 to-rose-600/20',
            iconColor: 'text-pink-400',
            glow: 'shadow-pink-500/20'
        },
        {
            title: 'Часов за 2 недели',
            value: ((userRecentlyGames?.games ?? []).reduce((sum, game) => sum + (game.playtime_2weeks ?? 0), 0) / 60).toFixed(1),
            icon: Clock,
            gradient: 'from-amber-500/20 to-yellow-600/20',
            iconColor: 'text-amber-400',
            glow: 'shadow-amber-500/20'
        },
    ];

    return (
        <>
            {stats.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="group/stat relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 backdrop-blur-md transition-all hover:border-white/20 hover:shadow-lg hover:shadow-white/5"
                >
                    {/* Hover glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 transition-opacity group-hover/stat:opacity-100`} />

                    <div className="relative flex items-center gap-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 rounded-xl bg-gradient-to-br ${stat.gradient} p-2.5 shadow-lg ${stat.glow}`}>
                            <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                        </div>

                        {/* Value */}
                        <div className="flex-1 min-w-0">
                            <p className="text-2xl font-bold text-white truncate">{stat.value}</p>
                            <p className="mt-0.5 text-xs text-gray-400 truncate">{stat.title}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </>
    );
};
export default UserStatistic;
