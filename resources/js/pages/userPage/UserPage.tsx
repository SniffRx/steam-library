import React, { useMemo, useCallback, Suspense, lazy } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { iso2name } from '@/lib/country';

const UserBans = lazy(() => import('@/pages/userPage/components/UserBans'));
const UserStatistic = lazy(() => import('@/pages/userPage/components/UserStatistic'));
const UserRecentlyGames = lazy(() => import('@/pages/userPage/components/UserRecentlyGames'));
const UserFriends = lazy(() => import('@/pages/userPage/components/UserFriends'));

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'User', href: '/user' },
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

    // Мемоизируем getStatusBadge чтобы не создавать объект заново каждый рендер
    const status = useMemo(() => {
        const statuses = [
            { text: 'Offline', gradient: 'from-gray-500 to-gray-600', glow: 'shadow-gray-500/50' },
            { text: 'Online', gradient: 'from-emerald-500 to-green-600', glow: 'shadow-emerald-500/50' },
            { text: 'Busy', gradient: 'from-red-500 to-rose-600', glow: 'shadow-red-500/50' },
            { text: 'Away', gradient: 'from-amber-500 to-yellow-600', glow: 'shadow-amber-500/50' },
            { text: 'Snooze', gradient: 'from-purple-500 to-violet-600', glow: 'shadow-purple-500/50' },
            { text: 'Looking to trade', gradient: 'from-orange-500 to-amber-600', glow: 'shadow-orange-500/50' },
            { text: 'Looking to play', gradient: 'from-blue-500 to-cyan-600', glow: 'shadow-blue-500/50' }
        ];
        return statuses[userInfo.personastate] || statuses[0];
    }, [userInfo.personastate]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${userInfo.personaname}'s Profile`} />

            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-black to-gray-900" />

            <div className="fixed inset-0 -z-10 overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white/5 blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/3 blur-3xl"
                />
            </div>

            <div className="relative space-y-6 px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:bg-white/10 hover:shadow-white/5"
                >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                    <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[auto_1fr_auto]">
                        <div className="relative flex flex-col gap-8 lg:flex-row">
                            <div className="flex-shrink-0">
                                <motion.div whileHover={{ scale: 1.05, rotate: 2 }} transition={{ type: "spring", stiffness: 300 }} className="relative mx-auto lg:mx-0">
                                    <div className={`absolute inset-0 animate-pulse rounded-full bg-gradient-to-r ${status.gradient} opacity-50 blur-xl`} />
                                    <div className="relative">
                                        <img src={userInfo.avatarfull} alt={userInfo.personaname} className="relative z-10 h-36 w-36 rounded-full border-4 border-white/20 shadow-2xl backdrop-blur-sm md:h-44 md:w-44" />
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="absolute -bottom-3 left-1/2 z-20 -translate-x-1/2 transform rounded-full border border-white/20 bg-gradient-to-r from-gray-900 to-black px-4 py-1.5 shadow-lg backdrop-blur-md">
                                            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-sm font-bold text-transparent">
                                                Level {userLevel}
                                            </span>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="flex-1 space-y-4 min-w-0">
                                {/* User info main content can go here */}
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex flex-col items-center gap-3 md:flex-row md:items-center lg:items-start">
                                <h1 className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-3xl font-bold text-transparent">
                                    {userInfo.personaname}
                                </h1>

                                <motion.span whileHover={{ scale: 1.05 }} className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${status.gradient} px-4 py-1.5 text-xs font-semibold text-white shadow-lg ${status.glow}`}>
                                    <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="h-2 w-2 rounded-full bg-white shadow-lg" />
                                    {status.text}
                                </motion.span>
                            </div>

                            {userInfo.realname && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-center text-lg font-medium text-gray-300 md:text-left">
                                    {userInfo.realname}
                                </motion.p>
                            )}

                            <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                                <motion.div whileHover={{ scale: 1.02, y: -2 }} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 backdrop-blur-md transition-all hover:border-white/20 hover:shadow-lg hover:shadow-white/5">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                    <p className="relative text-sm font-medium text-gray-400">Когда создан</p>
                                    <p className="relative mt-1 font-semibold text-white">
                                        {new Date(userInfo.timecreated * 1000).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </motion.div>

                                {userInfo.loccountrycode && (
                                    <motion.div whileHover={{ scale: 1.02, y: -2 }} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 backdrop-blur-md transition-all hover:border-white/20 hover:shadow-lg hover:shadow-white/5">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                        <p className="relative text-sm font-medium text-gray-400">Расположение</p>
                                        <p className="relative mt-1 font-semibold text-white">
                                            🌍 {iso2name[userInfo.loccountrycode as keyof typeof iso2name]}
                                        </p>
                                    </motion.div>
                                )}

                                <motion.div whileHover={{ scale: 1.02, y: -2 }} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 backdrop-blur-md transition-all hover:border-white/20 hover:shadow-lg hover:shadow-white/5">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                    <p className="relative text-sm font-medium text-gray-400">Последний вход</p>
                                    <p className="relative mt-1 font-semibold text-white">
                                        {new Date(userInfo.lastlogoff * 1000).toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </motion.div>

                                <Suspense fallback={<div>Loading stats...</div>}>
                                    <UserStatistic userFriends={userFriends} userRecentlyGames={userRecentlyGames} userGamesCount={userGamesCount} />
                                </Suspense>
                            </div>
                        </div>

                        <div className="flex items-start justify-center lg:justify-end">
                            <div className="w-full max-w-sm lg:w-80">
                                <Suspense fallback={<div>Loading bans...</div>}>
                                    <UserBans bans={userBans} />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Suspense fallback={<div>Loading games...</div>}>
                        <UserRecentlyGames userRecentlyGames={userRecentlyGames} />
                    </Suspense>
                    <Suspense fallback={<div>Loading friends...</div>}>
                        <UserFriends userFriends={userFriends} userInfo={userInfo} />
                    </Suspense>
                </motion.div>
            </div>
        </AppLayout>
    );
}
