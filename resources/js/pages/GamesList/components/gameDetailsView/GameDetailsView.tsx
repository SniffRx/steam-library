import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseButton } from '@/pages/GamesList/components/gameDetailsView/components/CloseButton';
import { GameRequirements } from '@/pages/GamesList/components/gameDetailsView/components/GameRequirements';
import { GameFriends } from '@/pages/GamesList/components/gameDetailsView/components/GameFriends';
import { GameAchievements } from '@/pages/GamesList/components/gameDetailsView/components/GameAchievements';
import { GameDetailsProps } from '@/pages/GamesList/components/gameDetailsView/types';
import { GamePrice } from '@/pages/GamesList/components/gameDetailsView/components/GamePrice';
import { GameMetacritic } from '@/pages/GamesList/components/gameDetailsView/components/GameMetacritic';
import { MediaCarousel } from '@/pages/GamesList/components/gameDetailsView/components/MediaCarousel';
import { Award, Users, Info, Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

export default function GameDetailsView({ game, details, loading, onClose }: GameDetailsProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'friends'>('overview');

    if (loading || !details?.game_info) {
        return (
            <div className="flex min-h-[500px] items-center justify-center p-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                        className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"
                    />
                    <p className="text-gray-400">Загрузка деталей игры...</p>
                </motion.div>
            </div>
        );
    }

    const info = details.game_info;
    const completedAchievements = details.achievements.filter((a) => a.achieved).length;
    const totalAchievements = details.achievements.length;

    const SafeHTMLRenderer = ({ html }: { html: string }) => {
        const sanitizedHTML = DOMPurify.sanitize(html);
        return (
            <div className="prose prose-invert max-w-none">
                {parse(sanitizedHTML)}
            </div>
        );
    };

    const tabs = [
        { key: 'overview', label: 'Обзор', icon: Info },
        { key: 'achievements', label: 'Достижения', icon: Award, badge: totalAchievements > 0 ? `${completedAchievements}/${totalAchievements}` : null },
        { key: 'friends', label: 'Друзья', icon: Users, badge: details.friendsPlaying?.length || null }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl"
        >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

            {/* Header Image */}
            <div className="relative h-72 overflow-hidden md:h-80 lg:h-96">
                <img
                    src={info.header_image}
                    alt={info.name || 'Header'}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: 'center top' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Close Button */}
                <div className="absolute top-4 right-4">
                    <CloseButton onClose={onClose} />
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-3 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-3xl font-bold text-transparent md:text-4xl"
                    >
                        {info.name}
                    </motion.h1>

                    {/* Meta Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap items-center gap-4"
                    >
                        <GamePrice details={details} />
                        <GameMetacritic details={details} />
                        {info.steam_deck_compatibility?.desc && (
                            <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                                Steam Deck: {info.steam_deck_compatibility.desc}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="relative p-6 md:p-8">
                {/* Tabs */}
                <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
                    {tabs.map((tab) => (
                        <motion.button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as typeof activeTab)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition-all ${
                                activeTab === tab.key
                                    ? 'bg-gradient-to-r from-blue-500/20 to-cyan-600/20 text-white shadow-lg shadow-blue-500/20'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <tab.icon className="h-4 w-4" />
                            <span>{tab.label}</span>
                            {tab.badge && (
                                <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                                    {tab.badge}
                                </span>
                            )}
                            {activeTab === tab.key && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-600"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {activeTab === 'overview' && (
                            <>
                                {/* Media Carousel */}
                                <MediaCarousel info={info} />

                                {/* Description */}
                                {info.detailed_description && (
                                    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                                            <Info className="h-5 w-5" />
                                            Описание
                                        </h3>
                                        <div className="prose prose-invert max-w-none text-gray-300">
                                            <SafeHTMLRenderer html={info.detailed_description} />
                                        </div>
                                    </section>
                                )}

                                {/* System Requirements */}
                                <GameRequirements info={info} />

                                {/* Genres & Categories */}
                                {(info.genres?.length || info.categories?.length) && (
                                    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                        <h3 className="mb-4 text-xl font-semibold text-white">Жанры и категории</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {info.genres?.map((genre, i) => (
                                                <motion.span
                                                    key={`genre-${i}`}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    className="rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-600/20 px-3 py-1.5 text-sm font-medium text-white shadow-lg shadow-blue-500/10"
                                                >
                                                    {genre.description}
                                                </motion.span>
                                            ))}
                                            {info.categories?.map((cat, i) => (
                                                <motion.span
                                                    key={`cat-${i}`}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: (info.genres?.length || 0) * 0.05 + i * 0.05 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    className="rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-600/20 px-3 py-1.5 text-sm font-medium text-white shadow-lg shadow-purple-500/10"
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
                            <GameAchievements
                                details={details}
                                completedAchievements={completedAchievements}
                                totalAchievements={totalAchievements}
                            />
                        )}

                        {activeTab === 'friends' && (
                            <GameFriends details={details} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
