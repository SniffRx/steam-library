// EnhancedGameDetailsView.tsx
import React, { useState } from 'react';
import HeroSection from './HeroSection';
import MediaGallery from './MediaGallery';
import InfoBlocks from './InfoBlocks';
import RightSidebar from './RightSidebar';
import { Game, GameDetails } from '@/pages/GamesList/Types/GameTypes'; // Новый компонент для правой панели

export default function EnhancedGameDetailsView({
                                                    game,
                                                    details,
                                                    isCompleted,
                                                    onCompletion
                                                }: {
    game: Game;
    details: GameDetails | null;
    isCompleted: boolean;
    onCompletion: () => void;
}) {
    const [activeMediaTab, setActiveMediaTab] = useState<'screenshots' | 'videos'>('screenshots');

    const achievementsArray = Array.isArray(details?.achievements) ? details.achievements : [];
    const unlockedAchievements = achievementsArray.filter(a => a.achieved);
    const lockedAchievements = achievementsArray.filter(a => !a.achieved);

    const screenshots = details?.screenshots?.map(s => ({
        id: s.id,
        url: s.path_full || s.path_thumbnail || details.header_image || 'https://via.placeholder.com/800x450/1a202c/718096?text=No+Image '
    })) || [];

    const videos = details?.movies?.map(m => ({
        id: m.id,
        title: m.name,
        thumbnail: m.thumbnail,
        videoUrl: m.mp4?.max || m.webm?.max
    })) || [];

    return (
        <div className="bg-gray-800/50 rounded-xl shadow-lg overflow-hidden">
            {/* Hero секция */}
            <HeroSection
                details={details}
                game={game}
                isCompleted={isCompleted}
                onCompletion={onCompletion}
            />

            <div className="flex flex-col lg:flex-row gap-6 p-6">
                {/* Основной контент слева */}
                <div className="lg:w-2/3">
                    {/* Галерея скриншотов / видео */}
                    {(screenshots.length > 0 || videos.length > 0) && (
                        <MediaGallery
                            screenshots={screenshots}
                            videos={videos}
                            activeMediaTab={activeMediaTab}
                            setActiveMediaTab={setActiveMediaTab}
                        />
                    )}

                    {/* Описание игры, достижения, друзья */}
                    <InfoBlocks details={details} /> {/* Теперь здесь только длинные блоки */}
                </div>

                {/* Сайдбар справа - статистика, кнопки, достижения */}
                <div className="lg:w-1/3">
                    <RightSidebar
                        game={game}
                        details={details}
                        isCompleted={isCompleted}
                        onCompletion={onCompletion}
                        unlockedAchievements={unlockedAchievements}
                        lockedAchievements={lockedAchievements}
                    />
                </div>
            </div>
        </div>
    );
}
