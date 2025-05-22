// RightSidebar.tsx
import React from 'react';
import { Achievement, GameDetails } from '@/pages/GamesList/Types/GameTypes';

interface RightSidebarProps {
    game: {
        appid: number;
        name: string;
        playtime_forever: number;
        achievements?: Achievement[];
    };
    details: GameDetails | null;
    isCompleted: boolean;
    onCompletion: () => void;
    unlockedAchievements: Achievement[];
    lockedAchievements: Achievement[];
}

export default function RightSidebar({
                                         game,
                                         details,
                                         isCompleted,
                                         onCompletion,
                                         unlockedAchievements
                                     }: RightSidebarProps) {
    const totalAchievements = details?.achievements?.length || 0;
    const percentUnlocked = totalAchievements > 0
        ? Math.round((unlockedAchievements.length / totalAchievements) * 100)
        : 0;
    // Возрастной рейтинг
    const getAgeRating = () => {
        if (!details?.ratings) return null;

        const ratings = Object.values(details.ratings).filter(r => r.rating);
        if (ratings.length === 0) return null;

        return ratings.map((rating: any, idx) => (
            <div key={idx} className="text-sm text-gray-300">
                {rating.rating} ({rating.required_age || 'All ages'})
                {rating.descriptors && (
                    <span className="block text-xs text-gray-500">{rating.descriptors}</span>
                )}
            </div>
        ));
    };
    // Поддерживаемые платформы
    const availablePlatforms = [
        { name: 'Windows', supported: details?.platforms?.windows },
        { name: 'macOS', supported: details?.platforms?.mac },
        { name: 'Linux', supported: details?.platforms?.linux }
    ].filter(p => p.supported);

    const parseLanguagesWithAudio = (languagesString?: string) => {
        if (!languagesString) return { allLanguages: [], audioLanguages: [], audioNote: '' };

        // Удаляем часть с примечанием об аудио поддержке (включая текст после последнего <br>)
        const cleanedString = languagesString
            .replace(/(<br[^>]*>|\n).*$/, '')  // Удаляем все после <br> или переноса строки
            .replace(/<[^>]+>/g, '')          // Удаляем все HTML-теги
            .trim();

        const allLanguages = cleanedString
            .split(',')
            .map(lang => lang.trim())
            .filter(lang => lang.length > 0);

        const audioLanguages = allLanguages
            .filter(lang => lang.includes('*'))
            .map(lang => lang.replace('*', '').trim());

        // Извлекаем примечание об аудио поддержке (если есть)
        const audioNoteMatch = languagesString.match(/(?:<br[^>]*>|\n)(.*)/);
        const audioNote = audioNoteMatch ? audioNoteMatch[1].trim() : '';

        return { allLanguages, audioLanguages, audioNote };
    };

    const languages = parseLanguagesWithAudio(details?.supported_languages);

    return (
        <div className="space-y-6">
            {/* Кнопка завершения */}
            <div className="bg-gray-700/50 rounded-xl p-5 sticky top-20 flex gap-2">
                <button
                    onClick={onCompletion}
                    className={`col-span-2 px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors w-full ${
                        isCompleted
                            ? 'bg-green-600/90 hover:bg-green-700 text-white'
                            : 'bg-blue-600/90 hover:bg-blue-700 text-white'
                    }`}
                >
                    {isCompleted ? (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M5 13l4 4L19 7" />
                            </svg>
                            Completed
                        </>
                    ) : 'Mark as Completed'}
                </button>

                <a
                    className="aspect-square h-12 rounded-lg flex items-center justify-center transition-colors bg-blue-600/90 hover:bg-blue-700 text-white"
                    target={'_blank'}
                    href={`https://store.steampowered.com/app/${game.appid}`}
                >
                    <svg fill="#ffffff" width="28px" height="28px" viewBox="0 0 32 32" version="1.1"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18.102 12.129c0-0 0-0 0-0.001 0-1.564 1.268-2.831 2.831-2.831s2.831 1.268 2.831 2.831c0 1.564-1.267 2.831-2.831 2.831-0 0-0 0-0.001 0h0c-0 0-0 0-0.001 0-1.563 0-2.83-1.267-2.83-2.83 0-0 0-0 0-0.001v0zM24.691 12.135c0-2.081-1.687-3.768-3.768-3.768s-3.768 1.687-3.768 3.768c0 2.081 1.687 3.768 3.768 3.768v0c2.080-0.003 3.765-1.688 3.768-3.767v-0zM10.427 23.76l-1.841-0.762c0.524 1.078 1.611 1.808 2.868 1.808 1.317 0 2.448-0.801 2.93-1.943l0.008-0.021c0.155-0.362 0.246-0.784 0.246-1.226 0-1.757-1.424-3.181-3.181-3.181-0.405 0-0.792 0.076-1.148 0.213l0.022-0.007 1.903 0.787c0.852 0.364 1.439 1.196 1.439 2.164 0 1.296-1.051 2.347-2.347 2.347-0.324 0-0.632-0.066-0.913-0.184l0.015 0.006zM15.974 1.004c-7.857 0.001-14.301 6.046-14.938 13.738l-0.004 0.054 8.038 3.322c0.668-0.462 1.495-0.737 2.387-0.737 0.001 0 0.002 0 0.002 0h-0c0.079 0 0.156 0.005 0.235 0.008l3.575-5.176v-0.074c0.003-3.12 2.533-5.648 5.653-5.648 3.122 0 5.653 2.531 5.653 5.653s-2.531 5.653-5.653 5.653h-0.131l-5.094 3.638c0 0.065 0.005 0.131 0.005 0.199 0 0.001 0 0.002 0 0.003 0 2.342-1.899 4.241-4.241 4.241-2.047 0-3.756-1.451-4.153-3.38l-0.005-0.027-5.755-2.383c1.841 6.345 7.601 10.905 14.425 10.905 8.281 0 14.994-6.713 14.994-14.994s-6.713-14.994-14.994-14.994c-0 0-0.001 0-0.001 0h0z"></path>
                    </svg>
                </a>
            </div>

            {/* Прогресс по времени и достижениям */}
            <div className="bg-gray-700/50 rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-3">Your Progress</h3>

                {/* Время в игре */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-300">
                        <span>Time Played</span>
                        <span>{(game.playtime_forever / 60).toFixed(0)} hours</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-300">
                        <span>Last Played</span>
                        <span>{game.rtime_last_played > 0 ? (
                            new Date(game.rtime_last_played * 1000).toLocaleDateString()
                        ) : (
                            <span className="text-gray-500">Never played</span>
                        )}</span>
                    </div>
                </div>

                {/* Достижения */}
                {totalAchievements > 0 && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-300">
                            <span>Achievements</span>
                            <span>{unlockedAchievements.length}/{totalAchievements}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                                style={{ width: `${percentUnlocked}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-400">{percentUnlocked}% completed</p>
                    </div>
                )}
            </div>

            {/* Информация о платформах */}
            {details?.platforms && (
                <div className="bg-gray-700/50 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Supported Platforms</h3>
                    <div className="flex flex-wrap gap-2">
                        {details.platforms.windows && (
                            <div className="px-3 py-1 bg-gray-600/50 rounded-md text-xs text-white">Windows</div>
                        )}
                        {details.platforms.mac && (
                            <div className="px-3 py-1 bg-gray-600/50 rounded-md text-xs text-white">macOS</div>
                        )}
                        {details.platforms.linux && (
                            <div className="px-3 py-1 bg-gray-600/50 rounded-md text-xs text-white">Linux</div>
                        )}
                    </div>
                </div>
            )}

            {details?.supported_languages && (
                <div className="bg-gray-700/50 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Supported Languages</h3>
                    <ul className="text-sm text-gray-300 grid grid-cols-2 gap-2">
                        {languages.allLanguages.map((language, index) => (  // <- Исправлено на languages.allLanguages
                            <li key={index}>{language}</li>
                        ))}
                    </ul>
                    {/* Дополнительно можно вывести примечание об аудио */}
                    {languages.audioLanguages.length > 0 && (
                        <p className="text-xs text-gray-400 mt-2">
                            *Languages with full audio support: {languages.audioLanguages.join(', ')}
                        </p>
                    )}
                </div>
            )}
            {/*/!* Возрастной рейтинг *!/*/}
            {/*{details?.content_descriptors?.ids && (*/}
            {/*    <div className="bg-gray-700/50 rounded-xl p-5">*/}
            {/*        <h3 className="text-sm font-semibold text-gray-400 mb-2">Content Descriptors</h3>*/}
            {/*        <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">*/}
            {/*            {details.content_descriptors.ids.map(id => ({*/}
            {/*                1: 'Mild Violence',*/}
            {/*                2: 'Nudity',*/}
            {/*                3: 'Sexual Content',*/}
            {/*                4: 'Language',*/}
            {/*                5: 'Drugs',*/}
            {/*                6: 'Alcohol',*/}
            {/*                7: 'Gambling',*/}
            {/*                8: 'User-generated content',*/}
            {/*            })[id]).filter(Boolean).map((desc, idx) => (*/}
            {/*                <li key={idx}>{desc}</li>*/}
            {/*            ))}*/}
            {/*        </ul>*/}
            {/*        {details.content_descriptors.notes && (*/}
            {/*            <p className="mt-2 text-xs text-gray-400">{details.content_descriptors.notes}</p>*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*)}*/}

            {/* DLC */}
            {details?.dlc && details.dlc.length > 0 && (
                <div className="bg-gray-700/50 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">DLC Packs</h3>
                    <div className="text-white font-medium">{details.dlc.length} available</div>
                </div>
            )}

            {/* Основная информация */}
            <div className="bg-gray-700/50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4a1 1 0 012-2h.01a1 1 0 012 2v.01a1 1 0 01-2 2H9a1 1 0 01-2-2V4z" />
                        <path d="M3 8a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" />
                        <path d="M13 8a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1V8z" />
                        <path d="M3 12a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1z" />
                        <path d="M13 12a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1z" />
                        <path d="M9 16a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1H9a1 1 0 01-1-1v-.01z" />
                    </svg>
                    Game Details
                </h3>

                <div className="space-y-4">
                    {/* Разработчики */}
                    {details?.developers?.length > 0 && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-md bg-blue-600/20 text-blue-400">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Developer</p>
                                <p className="text-white font-medium">{details.developers.join(', ')}</p>
                            </div>
                        </div>
                    )}

                    {/* Издатели */}
                    {details?.publishers?.length > 0 && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-md bg-purple-600/20 text-purple-400">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4a2 2 0 012-2h.01a2 2 0 012 2v.01a2 2 0 01-2 2H9a2 2 0 01-2-2V4z" />
                                    <path d="M3 8a2 2 0 012-2h1a2 2 0 012 2v1a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" />
                                    <path d="M13 8a2 2 0 012-2h1a2 2 0 012 2v1a2 2 0 01-2 2h-1a2 2 0 01-2-2V8z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Publisher</p>
                                <p className="text-white font-medium">{details.publishers.join(', ')}</p>
                            </div>
                        </div>
                    )}

                    {/* Дата релиза */}
                    {details?.release_date?.date && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-md bg-green-600/20 text-green-400">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd"
                                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 0 00-1-1zM5 5a1 0 000 2h8a1 0 000-2H5zm0 8a1 1 0 000 2h8a1 1 0 000-2H5z"
                                          clipRule="evenodd" />
                                    <path d="M10 15a1 1 0 000-2H5a1 1 0 000 2h5z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Release Date</p>
                                <p className="text-white font-medium">{details.release_date.date}</p>
                            </div>
                        </div>
                    )}

                    {/* Веб-сайт */}
                    {details?.website && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-md bg-indigo-600/20 text-indigo-400">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                          clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Official Website</p>
                                <a href={details.website}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="text-blue-400 hover:text-blue-300 transition-colors block truncate">
                                    {new URL(details.website).hostname}
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Возрастной рейтинг */}
                    {getAgeRating() && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-md bg-yellow-600/20 text-yellow-400">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 18a8 8 0 008-8 8 8 0 00-8-8 8 8 0 00-8 8 8 8 0 008 8z" />
                                    <path d="M10 4a6 6 0 100 12 6 6 0 000-12z" />
                                    <path d="M10 12a1 1 0 001-1V8a1 1 0 00-2 0v3a1 1 0 001 1z" />
                                    <path d="M10 16a1 1 0 001-1v-1a1 1 0 00-2 0v1a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Content Rating</p>
                                {getAgeRating()}
                                {details?.content_descriptors?.notes && (
                                    <p className="text-xs text-gray-500 mt-1">{details.content_descriptors.notes}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Платформы */}
                    {availablePlatforms.length > 0 && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-md bg-cyan-600/20 text-cyan-400">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
                                    <path d="M12 5a2 2 0 012-2h3a2 2 0 012 2v10a2 2 0 01-2 2h-3a2 2 0 01-2-2V5z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Available on</p>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {availablePlatforms.map((platform, index) => (
                                        <span key={index}
                                              className="px-2 py-1 bg-gray-700/50 rounded text-xs text-white">
                                            {platform.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Тип игры */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-pink-600/20 text-pink-400">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M9 4a1 1 0 000 2h2a1 1 0 001-1v-.01a1 1 0 00-1-1H9zm-9 7a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1v-2z" />
                                <path d="M9 19a1 1 0 001-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Game Type</p>
                            <p className="text-white font-medium">
                                {details?.is_free ? 'Free To Play' : 'Paid'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
