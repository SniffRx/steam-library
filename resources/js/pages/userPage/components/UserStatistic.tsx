import { motion } from 'framer-motion';
import { Gamepad2, Users, Clock, Heart } from 'lucide-react';

export const UserStatistic = ({ userGamesCount, userFriends, userRecentlyGames }) => {
    const stats = [
        {
            icon: Gamepad2,
            value: userGamesCount,
            label: 'Игр в библиотеке',
            color: 'text-blue-400',
            bg: 'from-blue-500/10 to-blue-500/5',
            border: 'border-blue-500/30',
            iconBg: 'bg-blue-500/20'
        },
        {
            icon: Users,
            value: userFriends.total_friends,
            label: 'Друзей в Steam',
            color: 'text-purple-400',
            bg: 'from-purple-500/10 to-purple-500/5',
            border: 'border-purple-500/30',
            iconBg: 'bg-purple-500/20'
        },
        {
            icon: Clock,
            value: ((userRecentlyGames?.games ?? []).reduce((sum, game) => sum + (game.playtime_2weeks ?? 0), 0) / 60).toFixed(1),
            label: 'Часов за 2 недели',
            color: 'text-yellow-400',
            bg: 'from-yellow-500/10 to-yellow-500/5',
            border: 'border-yellow-500/30',
            iconBg: 'bg-yellow-500/20'
        },
        {
            icon: Heart,
            value: userFriends.online_friends_count,
            label: 'Друзей онлайн',
            color: 'text-pink-400',
            bg: 'from-pink-500/10 to-pink-500/5',
            border: 'border-pink-500/30',
            iconBg: 'bg-pink-500/20'
        },
    ];

    return (
        <>
            {stats.map((stat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className={`bg-gradient-to-br ${stat.bg} backdrop-blur-sm rounded-2xl p-6 border ${stat.border} shadow-lg hover:shadow-xl transition-all`}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={`${stat.iconBg} p-3 rounded-xl`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                </motion.div>
            ))}
        </>
    );
};

export default UserStatistic;
