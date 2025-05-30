import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns'; // Для форматирования даты
import { ru } from 'date-fns/locale'; // Локализация под русский язык

interface GameInfo {
    name?: string;
    detailed_description?: string;
    header_image?: string;
    pc_requirements?: { minimum?: string };
    genres?: Array<{ description: string }>;
    categories?: Array<{ description: string }>;
    screenshots?: Array<{
        path_thumbnail: string;
        path_full: string;
    }>;
    movies?: Array<{
        id: number;
        name: string;
        thumbnail: string;
        webm?: { max: string };
    }>;
    ratings?: Record<string, any>;
    platforms?: {
        windows?: boolean;
        mac?: boolean;
        linux?: boolean;
    };
}

interface Achievement {
    apiname: string;
    name: string;
    description: string;
    icon: string;
    icon_gray: string;
    achieved: number; // 1 или 0
    unlocktime: number; // timestamp
}

interface Friend {
    steamid: string;
    personaname: string;
    avatar: string;
    gameextrainfo?: string;
}

interface Game {
    appid: number;
    name: string;
    playtime_forever: number;
}

interface GameDetailsProps {
    game: Game;
    details: {
        achievements: Achievement[];
        friendsPlaying: Friend[];
        game_info: GameInfo;
    } | null;
    loading: boolean;
    onClose: () => void;
}

export default function GameDetailsView({ game, details, loading, onClose }: GameDetailsProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'friends'>('overview');

    if (loading || !details?.game_info) {
        return (
            <div className="p-6 flex justify-center items-center min-h-[400px]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full"
                />
            </div>
        );
    }

    const info = details.game_info;

    // Подсчёт завершённых достижений
    const completedAchievements = details.achievements.filter(a => a.achieved).length;
    const totalAchievements = details.achievements.length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900/95 rounded-xl shadow-2xl border border-gray-700 overflow-hidden"
        >
            {/* Баннер игры */}
            <div className="relative overflow-hidden h-64 md:h-80 lg:h-96">
                <img
                    src={info.header_image}
                    alt={info.name || 'Header'}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center top' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                {/* Кнопка закрытия */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition z-10"
                    aria-label="Закрыть"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Название игры */}
            <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{info.name}</h2>

                {/* Платформы */}
                <div className="flex items-center space-x-3 mb-4">
                    {info.platforms?.windows && (
                        <img src="/images/windows.svg" alt="Windows" className="w-6 h-6" />
                    )}
                    {info.platforms?.mac && (
                        <img src="/images/mac.svg" alt="Mac" className="w-6 h-6" />
                    )}
                    {info.platforms?.linux && (
                        <img src="/images/linux.svg" alt="Linux" className="w-6 h-6" />
                    )}
                </div>

                {/* Табы */}
                <div className="flex space-x-4 border-b border-gray-700 mb-6">
                    <TabButton label="Обзор" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <TabButton label="Достижения" active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} />
                    <TabButton label="Друзья" active={activeTab === 'friends'} onClick={() => setActiveTab('friends')} />
                </div>

                {/* Контент табов */}
                <div className="space-y-6">
                    {/* Таб: Обзор */}
                    {activeTab === 'overview' && (
                        <>
                            {/* Описание */}
                            {info.detailed_description && (
                                <section>
                                    <h3 className="text-xl font-semibold text-white mb-2">Описание</h3>
                                    <div
                                        className="prose prose-invert max-w-none text-gray-300"
                                        dangerouslySetInnerHTML={{ __html: info.detailed_description }}
                                    />
                                </section>
                            )}

                            {/* Системные требования */}
                            {(info.pc_requirements?.minimum ||
                                info.mac_requirements?.minimum ||
                                info.linux_requirements?.minimum) && (
                                <section className="mb-6">
                                    <h3 className="text-xl font-semibold text-white mb-2">Системные требования</h3>
                                    <div className="space-y-4">
                                        {info.pc_requirements?.minimum && (
                                            <RequirementBox title="PC Minimum" html={info.pc_requirements.minimum} />
                                        )}
                                        {info.mac_requirements?.minimum && (
                                            <RequirementBox title="Mac Minimum" html={info.mac_requirements.minimum} />
                                        )}
                                        {info.linux_requirements?.minimum && (
                                            <RequirementBox title="Linux Minimum" html={info.linux_requirements.minimum} />
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* Жанры и категории */}
                            {(info.genres?.length || info.categories?.length) && (
                                <section>
                                    <h3 className="text-xl font-semibold text-white mb-2">Жанры и категории</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {info.genres?.map((genre, i) => (
                                            <span key={`genre-${i}`} className="bg-blue-900/50 px-3 py-1 rounded text-white text-sm">
                                                {genre.description}
                                            </span>
                                        ))}
                                        {info.categories?.map((cat, i) => (
                                            <span key={`cat-${i}`} className="bg-purple-900/50 px-3 py-1 rounded text-white text-sm">
                                                {cat.description}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Цена и Metacritic */}
                            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                {/* Цена */}
                                {details.game_info.package_groups?.[0]?.subs?.[0]?.price_in_cents_with_discount !== undefined && (
                                    <div>
                                        <h3 className="text-md font-medium text-gray-400">Цена</h3>
                                        <p className="text-lg text-white">
                                            {(
                                                details.game_info.package_groups[0].subs[0].price_in_cents_with_discount / 100
                                            ).toFixed(2)} ₽
                                        </p>
                                    </div>
                                )}

                                {/* Metacritic */}
                                {details.game_info.metacritic?.score && (
                                    <div>
                                        <h3 className="text-md font-medium text-gray-400">Metacritic</h3>
                                        <p className="text-lg text-white">
                                            {details.game_info.metacritic.score}/100
                                        </p>
                                    </div>
                                )}

                                {/* Steam Deck совместимость */}
                                {details.game_info.steam_deck_compatibility?.desc && (
                                    <div>
                                        <h3 className="text-md font-medium text-gray-400">Steam Deck</h3>
                                        <p className="text-lg text-white">
                                            {details.game_info.steam_deck_compatibility.desc}
                                        </p>
                                    </div>
                                )}
                            </section>

                            {/* Скриншоты с каруселью */}
                            {info.screenshots?.length > 0 && (
                                <section>
                                    <h3 className="text-xl font-semibold text-white mb-2">Скриншоты</h3>
                                    <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                                        <motion.div
                                            drag="x"
                                            dragConstraints={{ left: 0, right: 0 }}
                                            whileTap={{ cursor: 'grabbing' }}
                                            className="flex space-x-3 p-1"
                                        >
                                            {info.screenshots.slice(0, 6).map((shot, index) => (
                                                <motion.div
                                                    key={index}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="min-w-[120px] sm:min-w-[160px] md:min-w-[200px] lg:min-w-[240px] rounded overflow-hidden shadow hover:shadow-lg transition-shadow"
                                                    onClick={() => window.open(shot.path_full)}
                                                >
                                                    <img
                                                        src={shot.path_thumbnail.replace(/t=\d+/, '')} // уберём параметр кэширования
                                                        alt={`Screenshot ${index + 1}`}
                                                        className="w-full h-auto object-cover"
                                                        loading="lazy"
                                                    />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </div>
                                </section>
                            )}

                            {/* Видео трейлеры */}
                            {info.movies?.length > 0 && (
                                <section>
                                    <h3 className="text-xl font-semibold text-white mb-2">Видео</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {info.movies.slice(0, 2).map(movie => (
                                            <motion.div
                                                key={movie.id}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                className="bg-gray-800/50 rounded overflow-hidden"
                                            >
                                                <video
                                                    controls
                                                    poster={movie.thumbnail}
                                                    className="w-full h-auto bg-black"
                                                >
                                                    <source src={movie.webm?.max} type="video/webm" />
                                                    Ваш браузер не поддерживает видео.
                                                </video>
                                                <p className="p-2 text-sm text-gray-300">{movie.name}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    )}

                    {/* Таб: Достижения */}
                    {activeTab === 'achievements' && (
                        <section>
                            <h3 className="text-xl font-semibold text-white mb-4">
                                Достижения ({completedAchievements}/{totalAchievements})
                            </h3>
                            {totalAchievements > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {details.achievements.map((achievement) => {
                                        const isUnlocked = achievement.achieved === 1;

                                        // Форматируем дату, если достижение получено
                                        const unlockDate = achievement.unlocktime
                                            ? format(new Date(achievement.unlocktime * 1000), 'd MMM yyyy', { locale: ru })
                                            : null;

                                        return (
                                            <motion.div
                                                key={achievement.apiname}
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className={`bg-gray-700/50 p-4 rounded-lg flex items-center space-x-3 ${
                                                    isUnlocked
                                                        ? 'border-2 border-green-500 bg-gradient-to-r from-green-900/20 to-transparent'
                                                        : 'opacity-80'
                                                }`}
                                            >
                                                {/* Иконка */}
                                                <img
                                                    src={isUnlocked ? achievement.icon : achievement.icon_gray}
                                                    alt={achievement.name || 'Achievement Icon'}
                                                    className="w-12 h-12 object-cover rounded"
                                                    onError={(e) => {
                                                        e.currentTarget.src = '/images/achievement-locked.png';
                                                    }}
                                                />

                                                {/* Информация */}
                                                <div>
                                                    <h4 className="text-sm font-medium text-white">{achievement.name}</h4>
                                                    <p className="text-xs text-gray-400 line-clamp-1">
                                                        {achievement.description || 'Нет описания'}
                                                    </p>

                                                    {/* Дата разблокировки */}
                                                    {isUnlocked && unlockDate && (
                                                        <p className="mt-1 text-xs text-green-400">
                                                            Разблокировано: {unlockDate}
                                                        </p>
                                                    )}

                                                    {/* Статус */}
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {isUnlocked ? '✅ Получено' : '🔒 Не получено'}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-400">Нет достижений</p>
                            )}
                        </section>
                    )}


                    {/* Таб: Друзья */}
                    {activeTab === 'friends' && (
                        <section>
                            <h3 className="text-xl font-semibold text-white mb-4">
                                Друзья играют ({details.friendsPlaying.length})
                            </h3>
                            {details.friendsPlaying.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {details.friendsPlaying.map(friend => (
                                        <motion.div
                                            key={friend.steamid}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="bg-gray-800/50 backdrop-blur-sm p-4 rounded flex items-center space-x-4"
                                        >
                                            <img
                                                src={friend.avatar}
                                                alt={friend.personaname}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <h4 className="text-sm font-medium text-white">{friend.personaname}</h4>
                                                <p className="text-xs text-gray-400">{friend.gameextrainfo}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">Нет друзей, которые играют в эту игру</p>
                            )}
                        </section>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// Компонент для табов
function TabButton({
                       label,
                       active,
                       onClick
                   }: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`py-2 px-4 font-medium ${
                active
                    ? 'text-white border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white'
            }`}
        >
            {label}
        </button>
    );
}

// Компонент для требований
function RequirementBox({ title, html }: { title: string; html: string }) {
    return (
        <div className="bg-gray-800/50 p-4 rounded">
            <h4 className="font-medium text-gray-300">{title}</h4>
            <div
                className="text-sm text-gray-400 mt-2"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}
