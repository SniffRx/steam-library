import { motion } from 'framer-motion';

export default function UserInfoCenter({ userInfo, userFriends, userRecentlyGames, userGamesCount }) {
    return (
        <div className="flex-1 space-y-4 min-w-0">
            <div className="flex flex-col items-center gap-3 md:flex-row md:items-center lg:items-start">
                <h1 className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-3xl font-bold text-transparent">{userInfo.personaname}</h1>
                <motion.span whileHover={{ scale: 1.05 }} className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${getStatusGradient(userInfo.personastate)} px-4 py-1.5 text-xs font-semibold text-white shadow-lg`}>
                    <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="h-2 w-2 rounded-full bg-white shadow-lg" />
                    {getStatusText(userInfo.personastate)}
                </motion.span>
            </div>

            {userInfo.realname && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-center text-lg font-medium text-gray-300 md:text-left">{userInfo.realname}</motion.p>}

            {/* Вставить прочие детали и UserStatistic компонент */}
        </div>
    );
}

function getStatusGradient(status: number) {
    const statuses = [
        'from-gray-500 to-gray-600',
        'from-emerald-500 to-green-600',
        'from-red-500 to-rose-600',
        'from-amber-500 to-yellow-600',
        'from-purple-500 to-violet-600',
        'from-orange-500 to-amber-600',
        'from-blue-500 to-cyan-600'
    ];
    return statuses[status] || statuses[0];
}

function getStatusText(status: number) {
    const texts = ['Offline', 'Online', 'Busy', 'Away', 'Snooze', 'Looking to trade', 'Looking to play'];
    return texts[status] || texts[0];
}
