import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseButton } from '@/pages/GamesList/components/gameDetailsView/components/CloseButton';
import { GameDetailsProps } from '@/pages/GamesList/components/gameDetailsView/types';
import { Award, Users, Info, Calendar, TrendingUp } from 'lucide-react';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const GameAchievements = lazy(() => import('./components/GameAchievements'));
const GameFriends = lazy(() => import('./components/GameFriends'));
const GameRequirements = lazy(() => import('./components/GameRequirements'));
const MediaCarousel = lazy(() => import('./components/MediaCarousel'));

export default function GameDetailsView({ details, loading, onClose }: GameDetailsProps) {
    const [activeTab, setActiveTab] = useState('overview');

    const info = details.game_info;
    const completedAchievements = useMemo(() => details.achievements.filter(a => a.achieved).length, [details.achievements]);
    const totalAchievements = useMemo(() => details.achievements.length, [details.achievements]);

    const tabs = useMemo(() => [
        { key: 'overview', label: 'Обзор', icon: Info },
        { key: 'achievements', label: 'Достижения', icon: Award, badge: totalAchievements > 0 ? `${completedAchievements}/${totalAchievements}` : null },
        { key: 'friends', label: 'Друзья', icon: Users, badge: details.friendsPlaying?.length || null },
    ], [totalAchievements, completedAchievements, details.friendsPlaying]);

    const SafeHTMLRenderer = useCallback(({ html }) => {
        const sanitizedHTML = DOMPurify.sanitize(html);
        return <div className="prose prose-invert max-w-none">{parse(sanitizedHTML)}</div>;
    }, []);

    if (loading || !details?.game_info) {
        return (
            <div className="flex min-h-[500px] flex-col items-center justify-center p-12 text-center bg-[#1a1f29]/80 backdrop-blur-xl rounded-3xl border border-white/5">
                <LoadingSpinner />
                <p className="mt-4 text-lg text-slate-400">Загрузка деталей игры...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#1a1f29]/90 backdrop-blur-xl shadow-2xl"
        >
            {/* Header Image with Gradient Overlay */}
            <div className="relative h-80 lg:h-96 overflow-hidden">
                <img
                    src={info.header_image}
                    alt={info.name || 'Game Header'}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: 'center 30%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f29] via-[#1a1f29]/70 to-transparent" />

                {/* Close Button */}
                <CloseButton onClose={onClose} />

                {/* Title & Meta Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold mb-4 font-['Instrument_Sans'] bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
                    >
                        {info.name}
                    </motion.h1>

                    {/* Meta Info Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap items-center gap-4"
                    >
                        {/* Release Date */}
                        {info.release_date?.date && (
                            <div className="flex items-center gap-2 bg-slate-900/60 border border-white/10 backdrop-blur-md px-4 py-2 rounded-xl">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-medium text-white">{info.release_date.date}</span>
                            </div>
                        )}

                        {/* Price */}
                        {info.price !== undefined && info.price !== null && (
                            <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 backdrop-blur-md px-4 py-2 rounded-xl">
                                <TrendingUp className="w-4 h-4 text-green-400" />
                                <span className="text-sm font-semibold text-green-400">{info.price}</span>
                            </div>
                        )}

                        {/* Metacritic */}
                        {info.metacritic_score && (() => {
                            const score = info.metacritic_score;
                            const scoreColors = score >= 75
                                ? { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' }
                                : score >= 50
                                    ? { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' }
                                    : { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' };

                            return (
                                <div className={`flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-xl border ${scoreColors.bg} ${scoreColors.border}`}>
                                <span className={`text-sm font-bold ${scoreColors.text}`}>
                                    {score}
                                </span>
                                    <span className="text-xs text-slate-400">Metacritic</span>
                                </div>
                            );
                        })()}

                        {/* Steam Deck */}
                        {info.steam_deck_compatibility?.desc && (
                            <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 backdrop-blur-md px-4 py-2 rounded-xl">
                                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                                <span className="text-sm font-medium text-blue-400">{info.steam_deck_compatibility.desc}</span>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map((tab) => (
                        <motion.button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                                activeTab === tab.key
                                    ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/20'
                                    : 'bg-slate-900/40 text-slate-400 border border-white/5 hover:bg-slate-900/60 hover:text-white'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                            {tab.badge && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                    activeTab === tab.key
                                        ? 'bg-blue-500/30 text-blue-200'
                                        : 'bg-slate-700/50 text-slate-300'
                                }`}>
                                {tab.badge}
                            </span>
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-8"
                    >
                        {activeTab === 'overview' && (
                            <>
                                {/* Media Carousel */}
                                <Suspense fallback={<div className="h-64 bg-slate-900/50 rounded-2xl animate-pulse"></div>}>
                                    <MediaCarousel info={info} />
                                </Suspense>

                                {/* Description */}
                                {info.detailed_description && (
                                    <section className="rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-sm p-6">
                                        <h3 className="flex items-center gap-2 text-xl font-bold mb-4 text-white">
                                            <Info className="w-5 h-5 text-blue-400" />
                                            Описание
                                        </h3>
                                        <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed">
                                            <SafeHTMLRenderer html={info.detailed_description} />
                                        </div>
                                    </section>
                                )}

                                {/* System Requirements */}
                                <Suspense fallback={<div className="h-48 bg-slate-900/50 rounded-2xl animate-pulse"></div>}>
                                    <GameRequirements info={info} />
                                </Suspense>

                                {/* Genres & Categories */}
                                {(info.genres?.length || info.categories?.length) && (
                                    <section className="rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-sm p-6">
                                        <h3 className="text-xl font-bold mb-4 text-white">Жанры и категории</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {info.genres?.map((genre, i) => (
                                                <motion.span
                                                    key={`genre-${i}`}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.03 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-sm font-semibold text-blue-300 shadow-lg"
                                                >
                                                    {genre.description}
                                                </motion.span>
                                            ))}
                                            {info.categories?.map((cat, i) => (
                                                <motion.span
                                                    key={`cat-${i}`}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: (info.genres?.length || 0) * 0.03 + i * 0.03 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-sm font-semibold text-purple-300 shadow-lg"
                                                >
                                                    {cat.description}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </>
                        )}

                        {activeTab === 'achievements' && (
                            <Suspense fallback={<div className="h-96 bg-slate-900/50 rounded-2xl animate-pulse"></div>}>
                                <GameAchievements
                                    details={details}
                                    completedAchievements={completedAchievements}
                                    totalAchievements={totalAchievements}
                                />
                            </Suspense>
                        )}

                        {activeTab === 'friends' && (
                            <Suspense fallback={<div className="h-96 bg-slate-900/50 rounded-2xl animate-pulse"></div>}>
                                <GameFriends details={details} />
                            </Suspense>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <style>{`
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}</style>
        </motion.div>
    );
}
