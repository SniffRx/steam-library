import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { iso2name } from '@/lib/country';
import { UserBans } from '@/pages/userPage/components/UserBans';
import { UserStatistic } from '@/pages/userPage/components/UserStatistic';
import { UserRecentlyGames } from '@/pages/userPage/components/UserRecentlyGames';
import { UserFriends } from '@/pages/userPage/components/UserFriends';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User',
        href: '/user',
    },
];

export default function UserPage() {
    const { userInfo, userBans, userLevel, userFriends, userRecentlyGames, userGamesCount } = usePage<{
        userInfo: UserInfo;
        userBans: UserBans;
        userLevel: UserLevel;
        userFriends: UserFriends;
        userRecentlyGames: UserRecentlyGames;
        userGamesCount: UserGamesCount;
    }>().props;

    const getStatusBadge = (status: number) => {
        const statuses = [
            { text: 'Offline', color: 'bg-gray-500' },
            { text: 'Online', color: 'bg-green-500' },
            { text: 'Busy', color: 'bg-red-500' },
            { text: 'Away', color: 'bg-yellow-500' },
            { text: 'Snooze', color: 'bg-purple-500' },
            { text: 'Looking to trade', color: 'bg-amber-500' },
            { text: 'Looking to play', color: 'bg-blue-500' }
        ];
        return statuses[status] || statuses[0];
    };

    const status = getStatusBadge(userInfo.personastate);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${userInfo.personaname}'s Profile`} />

            <div className="rounded-2xl bg-gradient-to-br from-[#0f2027] to-[#2c5364] p-6 text-white shadow-lg">
                {/* Профиль пользователя */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-8 md:flex-row">
                    <div className="group relative">
                        <motion.div whileHover={{ scale: 1.05 }} className="group relative">
                            <img
                                src={userInfo.avatarfull}
                                alt={userInfo.personaname}
                                className="h-32 w-32 rounded-full border-4 border-[#66C0F4]/50 shadow-xl md:h-40 md:w-40"
                            />
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 transform rounded-full border border-[#66C0F4]/30 bg-[#1B2838] px-3 py-0.5 text-sm">
                                <span className="font-bold text-[#66C0F4]">Level {userLevel}</span>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold">{userInfo.personaname}</h1>
                            <span className={`rounded-full px-3 py-1 text-xs ${status.color} flex items-center gap-1`}>
                                <span className="h-2 w-2 rounded-full bg-white"></span>
                                {status.text}
                            </span>
                        </div>

                        {userInfo.realname && <p className="font-semibold text-[#C7D5E0]">{userInfo.realname}</p>}

                        <div className="grid grid-cols-2 gap-4 pt-4 md:grid-cols-3">
                            <div className="rounded-lg border border-[#66C0F4]/20 bg-[#1B2838]/50 p-3">
                                <p className="text-sm text-[#C7D5E0]">Когда создан</p>
                                <p className="font-medium">{new Date(userInfo.timecreated * 1000).toLocaleDateString()}</p>
                            </div>
                            {userInfo.loccountrycode && (
                                <div className="rounded-lg border border-[#66C0F4]/20 bg-[#1B2838]/50 p-3">
                                    <p className="text-sm text-[#C7D5E0]">Расположение</p>
                                    <p className="font-medium">🌍 {iso2name[userInfo.loccountrycode as keyof typeof iso2name]}</p>
                                </div>
                            )}
                            <div className="rounded-lg border border-[#66C0F4]/20 bg-[#1B2838]/50 p-3">
                                <p className="text-sm text-[#C7D5E0]">Последний вход</p>
                                <p className="font-medium">{new Date(userInfo.lastlogoff * 1000).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Блоки с информацией */}
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <UserBans bans={userBans} />
                    <UserStatistic userFriends={userFriends} userRecentlyGames={userRecentlyGames} userGamesCount={userGamesCount} />
                </div>

                {/* Игры и друзья в одной строке */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2"
                >
                    {/* Блок недавних игр */}
                    <UserRecentlyGames userRecentlyGames={userRecentlyGames} />

                    {/* Блок друзей онлайн */}
                    <UserFriends userFriends={userFriends} userInfo={userInfo} />
                </motion.div>
            </div>
        </AppLayout>
    );
}
