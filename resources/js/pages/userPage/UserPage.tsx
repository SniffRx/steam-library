import React, { useMemo, Suspense, lazy } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { iso2name } from '@/lib/country';
import { ExternalLink, Calendar, MapPin, Clock, TrendingUp } from 'lucide-react';

const UserBans = lazy(() => import('@/pages/userPage/components/UserBans'));
const UserStatistic = lazy(() => import('@/pages/userPage/components/UserStatistic'));
const UserRecentlyGames = lazy(() => import('@/pages/userPage/components/UserRecentlyGames'));
const UserFriends = lazy(() => import('@/pages/userPage/components/UserFriends'));

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'User Profile', href: '#' },
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

    const status = useMemo(() => {
        const statuses = [
            { text: 'Не в сети', color: 'text-slate-400', bg: 'bg-slate-500/20', border: 'border-slate-500/30', dot: 'bg-slate-400' },
            { text: 'В сети', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30', dot: 'bg-green-400' },
            { text: 'Занят', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', dot: 'bg-red-400' },
            { text: 'Отошёл', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
            { text: 'Не беспокоить', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/30', dot: 'bg-purple-400' },
            { text: 'Хочет обменяться', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30', dot: 'bg-orange-400' },
            { text: 'Ищет игру', color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30', dot: 'bg-cyan-400' }
        ];
        return statuses[userInfo.personastate] || statuses[0];
    }, [userInfo.personastate]);

    const totalHours = useMemo(() => {
        return ((userRecentlyGames?.games ?? []).reduce((sum, game) => sum + (game.playtime_2weeks ?? 0), 0) / 60).toFixed(1);
    }, [userRecentlyGames]);

    const accountAge = useMemo(() => {
        const created = new Date(userInfo.timecreated * 1000);
        const now = new Date();
        const years = now.getFullYear() - created.getFullYear();
        return years;
    }, [userInfo.timecreated]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${userInfo.personaname} - Steam Profile`} />

            <div className="min-h-screen bg-[#0e1217] relative overflow-hidden">
                {/* Enhanced animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-6">
                    {/* Hero Section - Profile Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden bg-gradient-to-br from-[#1a1f29]/90 via-[#1a1f29]/80 to-[#1a1f29]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl"
                    >
                        {/* Decorative gradient overlay */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none"></div>

                        <div className="relative p-8">
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Avatar Section */}
                                <div className="flex-shrink-0">
                                    <motion.div
                                        whileHover={{ scale: 1.03, rotate: 1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className="relative group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all"></div>
                                        <img
                                            src={userInfo.avatarfull}
                                            alt={userInfo.personaname}
                                            className="relative w-40 h-40 rounded-3xl border-2 border-white/20 shadow-2xl"
                                        />
                                        {/* Level badge */}
                                        <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center border-4 border-[#1a1f29] shadow-2xl">
                                            <div className="text-center">
                                                <div className="text-xs font-medium text-white/70">LVL</div>
                                                <div className="text-lg font-bold text-white leading-none">{userLevel}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* User Info Section */}
                                <div className="flex-1 min-w-0 space-y-6">
                                    {/* Name & Status */}
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <h1 className="text-4xl font-bold font-['Instrument_Sans'] bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                                {userInfo.personaname}
                                            </h1>
                                            <motion.span
                                                whileHover={{ scale: 1.05 }}
                                                className={`inline-flex items-center gap-2 ${status.bg} ${status.border} border px-4 py-2 rounded-xl text-sm font-semibold ${status.color} shadow-lg`}
                                            >
                                                <motion.span
                                                    animate={{ scale: [1, 1.3, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className={`w-2.5 h-2.5 rounded-full ${status.dot} shadow-lg`}
                                                ></motion.span>
                                                {status.text}
                                            </motion.span>
                                        </div>

                                        {userInfo.realname && (
                                            <p className="text-xl text-slate-400 flex items-center gap-2">
                                                {userInfo.realname}
                                            </p>
                                        )}

                                        {/* Quick Actions */}
                                        <div className="flex gap-3 mt-4">
                                            <motion.a
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                href={userInfo.profileurl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Steam профиль
                                            </motion.a>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => window.location.href = `steam://friends/message/${userInfo.steamid}`}
                                                className="inline-flex items-center gap-2 bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/30 text-slate-400 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                Написать
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Ban Status Badges */}
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="flex flex-wrap gap-2"
                                    >
                                        {[
                                            {
                                                label: 'Game Bans',
                                                value: userBans.NumberOfGameBans === 0,
                                                count: userBans.NumberOfGameBans
                                            },
                                            {
                                                label: 'VAC',
                                                value: !userBans.VACBanned,
                                                count: userBans.NumberOfVACBans
                                            },
                                            {
                                                label: 'Community',
                                                value: !userBans.CommunityBanned
                                            },
                                            {
                                                label: 'Trade',
                                                value: userBans.EconomyBan === 'none',
                                                extra: userBans.EconomyBan !== 'none' ? userBans.EconomyBan : null
                                            },
                                        ].map((ban, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.15 + i * 0.05 }}
                                                whileHover={{ scale: 1.05 }}
                                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                                                    ban.value
                                                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                                                }`}
                                            >
                                                {ban.value ? (
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                )}
                                                <span>{ban.label}</span>
                                                {!ban.value && ban.count > 0 && (
                                                    <span className="ml-1 px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 text-xs font-bold">
                        {ban.count}
                    </span>
                                                )}
                                                {ban.extra && (
                                                    <span className="ml-1 text-xs opacity-75">
                        ({ban.extra})
                    </span>
                                                )}
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {/* Account Details Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                                            <div className="flex items-center gap-2 text-slate-400 mb-2">
                                                <Calendar className="w-4 h-4" />
                                                <span className="text-xs font-medium">Аккаунт создан</span>
                                            </div>
                                            <p className="text-sm font-bold text-white">
                                                {new Date(userInfo.timecreated * 1000).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">{accountAge} {accountAge === 1 ? 'год' : accountAge < 5 ? 'года' : 'лет'} назад</p>
                                        </div>

                                        {userInfo.loccountrycode && (
                                            <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="text-xs font-medium">Местоположение</span>
                                                </div>
                                                <p className="text-sm font-bold text-white">
                                                    {iso2name[userInfo.loccountrycode as keyof typeof iso2name]}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">🌍 {userInfo.loccountrycode.toUpperCase()}</p>
                                            </div>
                                        )}

                                        <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                                            <div className="flex items-center gap-2 text-slate-400 mb-2">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-xs font-medium">Последний вход</span>
                                            </div>
                                            <p className="text-sm font-bold text-white">
                                                {new Date(userInfo.lastlogoff * 1000).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {new Date(userInfo.lastlogoff * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>

                                        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30">
                                            <div className="flex items-center gap-2 text-blue-400 mb-2">
                                                <TrendingUp className="w-4 h-4" />
                                                <span className="text-xs font-medium">Активность</span>
                                            </div>
                                            <p className="text-sm font-bold text-white">{totalHours}ч</p>
                                            <p className="text-xs text-blue-400 mt-1">за 2 недели</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </motion.div>

                    {/* Statistics Overview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        <Suspense fallback={null}>
                            <UserStatistic
                                userFriends={userFriends}
                                userRecentlyGames={userRecentlyGames}
                                userGamesCount={userGamesCount}
                            />
                        </Suspense>
                    </motion.div>

                    {/* Games & Friends Grid - убрана секция UserBans */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        <Suspense fallback={<div className="animate-pulse h-96 bg-slate-900/50 rounded-2xl"></div>}>
                            <UserRecentlyGames userRecentlyGames={userRecentlyGames} />
                        </Suspense>
                        <Suspense fallback={<div className="animate-pulse h-96 bg-slate-900/50 rounded-2xl"></div>}>
                            <UserFriends userFriends={userFriends} userInfo={userInfo} />
                        </Suspense>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
