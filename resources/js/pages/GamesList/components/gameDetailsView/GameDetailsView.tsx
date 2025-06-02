import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CloseButton } from '@/pages/GamesList/components/gameDetailsView/components/CloseButton';
import { GameRequirements } from '@/pages/GamesList/components/gameDetailsView/components/GameRequirements';
import { GameFriends } from '@/pages/GamesList/components/gameDetailsView/components/GameFriends';
import { GameAchievements } from '@/pages/GamesList/components/gameDetailsView/components/GameAchievements';
import { GameDetailsProps } from '@/pages/GamesList/components/gameDetailsView/types';
import { GamePrice } from '@/pages/GamesList/components/gameDetailsView/components/GamePrice';
import { GameMetacritic } from '@/pages/GamesList/components/gameDetailsView/components/GameMetacritic';
import { MediaCarousel } from '@/pages/GamesList/components/gameDetailsView/components/MediaCarousel';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

export default function GameDetailsView({ game, details, loading, onClose }: GameDetailsProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'friends'>('overview');

    if (loading || !details?.game_info) {
        return (
            <div className="flex min-h-[400px] items-center justify-center p-6">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="h-8 w-8 rounded-full border-t-2 border-b-2 border-blue-500"
                />
            </div>
        );
    }

    const info = details.game_info;

    // Подсчёт завершённых достижений
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-xl border border-gray-700 bg-gray-900/95 shadow-2xl"
        >
            {/* Баннер игры */}
            <div className="relative h-64 overflow-hidden md:h-80 lg:h-96">
                <img
                    src={info.header_image}
                    alt={info.name || 'Header'}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: 'center top' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                {/* Кнопка закрытия */}
                <CloseButton onClose={onClose} />
            </div>

            {/* Название игры */}
            <div className="p-6">
                <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <h2 className="mb-2 text-2xl font-bold text-white">{info.name}</h2>
                    <GamePrice details={details} />
                    <GameMetacritic details={details} />

                    {/* Steam Deck совместимость */}
                    {details.game_info.steam_deck_compatibility?.desc && (
                        <div>
                            <h3 className="text-md font-medium text-gray-400">Steam Deck</h3>
                            <p className="text-lg text-white">{details.game_info.steam_deck_compatibility.desc}</p>
                        </div>
                    )}
                </section>

                {/* Табы */}
                <div className="mb-6 flex space-x-4 border-b border-gray-700">
                    <TabButton label="Обзор" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <TabButton label="Достижения" active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} />
                    <TabButton label="Друзья" active={activeTab === 'friends'} onClick={() => setActiveTab('friends')} />
                </div>

                {/* Контент табов */}
                <div className="space-y-6">
                    {/* Таб: Обзор */}
                    {activeTab === 'overview' && (
                        <>
                            <MediaCarousel info={info} />

                            {/* Описание */}
                            {info.detailed_description && (
                                <section>
                                    <h3 className="mb-2 text-xl font-semibold text-white">Описание</h3>
                                    <div className="prose prose-invert max-w-none text-gray-300">
                                        <SafeHTMLRenderer html={info.detailed_description} />
                                    </div>
                                </section>
                            )}

                            {/* Системные требования */}
                            <GameRequirements info={info} />

                            {/* Жанры и категории */}
                            {(info.genres?.length || info.categories?.length) && (
                                <section>
                                    <h3 className="mb-2 text-xl font-semibold text-white">Жанры и категории</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {info.genres?.map((genre, i) => (
                                            <span key={`genre-${i}`} className="rounded bg-blue-900/50 px-3 py-1 text-sm text-white">
                                                {genre.description}
                                            </span>
                                        ))}
                                        {info.categories?.map((cat, i) => (
                                            <span key={`cat-${i}`} className="rounded bg-purple-900/50 px-3 py-1 text-sm text-white">
                                                {cat.description}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    )}

                    {/* Таб: Достижения */}
                    {activeTab === 'achievements' && (
                        <GameAchievements
                            details={details}
                            completedAchievements={completedAchievements}
                            totalAchievements={totalAchievements}
                        />
                    )}

                    {/* Таб: Друзья */}
                    {activeTab === 'friends' && (
                        <GameFriends details={details} />
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// Компонент для табов
function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 font-medium ${active ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
        >
            {label}
        </button>
    );
}
