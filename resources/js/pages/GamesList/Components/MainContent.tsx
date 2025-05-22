// MainContent.tsx
import React from 'react';
import EnhancedAchievementCard from './EnhancedAchievementCard';

interface MainContentProps {
    details: GameDetails | null;
    achievementsArray: Achievement[];
    unlockedAchievements: Achievement[];
    lockedAchievements: Achievement[];
}

export default function MainContent({
                                        details,
                                        achievementsArray,
                                        unlockedAchievements,
                                        lockedAchievements
                                    }: MainContentProps) {
    return (
        <div className="p-6 space-y-8">
            {/* Подробное описание */}
            {details?.about_the_game && (
                <div className="bg-gray-700/30 rounded-xl p-5">
                    <h2 className="text-xl font-bold text-white mb-4">About the Game</h2>
                    <div
                        className="prose prose-invert max-w-none text-gray-300"
                        dangerouslySetInnerHTML={{ __html: details.about_the_game }}
                    />
                    {details?.website && (
                        <a
                            href={details.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center mt-4 text-blue-400 hover:text-blue-300"
                        >
                            Visit official website
                            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M11 3a1 1 0 100 2H9.414l5.293 5.293a1 1 0 101.414-1.414L11 3z" />
                                <path
                                    d="M4 4v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H4z" />
                            </svg>
                        </a>
                    )}
                </div>
            )}
            {/* Друзья с этой игрой */}
            {details?.friends && details.friends.length > 0 && (
                <div className="bg-gray-700/30 rounded-xl p-5">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 01-8 0v-5a4 4 0 018 0v5z" />
                            <path
                                d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                        </svg>
                        Friends with this game ({details.friends.length})
                    </h2>
                    <div className="space-y-4">
                        {details.friends.map(friend => (
                            <div key={friend.steamid} className="bg-gray-700/50 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <img
                                        src={friend.avatar}
                                        alt={friend.personaname}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <h3 className="font-medium text-white">{friend.personaname}</h3>
                                        <p className="text-xs text-gray-400">Playing now</p>
                                    </div>
                                </div>
                                {/* Достижения друга */}
                                <div className="pl-13">
                                    <h4 className="text-sm font-medium text-gray-300 mb-2">Recent Achievements</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {friend.achievements?.slice(0, 3).map(achievement => (
                                            <div key={`${friend.steamid}-${achievement.name}`}
                                                 className="bg-gray-600/30 rounded p-2 flex items-center gap-2">
                                                {achievement.icon ? (
                                                    <img
                                                        src={achievement.icon}
                                                        alt={achievement.name}
                                                        className="w-8 h-8"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = '/images/placeholder-achievement.png';
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-xs text-gray-400">
                                                        ?
                                                    </div>
                                                )}
                                                <div className="truncate">
                                                    <p className="text-xs font-medium truncate text-white">
                                                        {achievement.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400">Unlocked</p>
                                                </div>
                                            </div>
                                        )) || (
                                            <p className="text-xs text-gray-500">No achievements data</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Достижения */}
            <div className="bg-gray-700/30 rounded-xl p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M10 12a2 2 0 002 2v5h4a1 1 0 00.82 1.573l-7 10A1 1 0 008 18v-5H4a1 1 0 00-.82-1.573l7-10a1 1 0 001.12-.38z" />
                        </svg>
                        Achievements ({unlockedAchievements.length}/{achievementsArray.length || 0})
                    </h2>
                    {/* Прогресс-бар */}
                    <div className="w-full sm:w-64">
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                            <span>Completion</span>
                            <span>{Math.round((unlockedAchievements.length / (achievementsArray.length || 1)) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full"
                                style={{
                                    width: `${(unlockedAchievements.length / (achievementsArray.length || 1)) * 100}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
                {/* Разблокированные достижения */}
                {unlockedAchievements.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                          clipRule="evenodd" />
                                </svg>
                                Unlocked ({unlockedAchievements.length})
                            </h3>
                            <button className="text-xs text-gray-400 hover:text-white">
                                View all
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {unlockedAchievements.slice(0, 4).map(achievement => (
                                <EnhancedAchievementCard
                                    key={achievement.apiname}
                                    achievement={achievement}
                                    unlocked={true}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {/* Заблокированные достижения */}
                {lockedAchievements.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                     strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M12 11a1 1 0 00-1 1v4a1 1 0 002 0v-4a1 1 0 00-1-1z" />
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M10.06 13.44A9.007 9.007 0 0112 12.02c4.97 0 9 4.03 9 9 0 .48-.39.87-.87.87s-.87-.39-.87-.87a7.002 7.002 0 00-13.26 0c0 .48-.39.87-.87.87s-.87-.39-.87-.87a9.007 9.007 0 011.96-5.56z" />
                                </svg>
                                Locked ({lockedAchievements.length})
                            </h3>
                            <button className="text-xs text-gray-400 hover:text-white">
                                View all
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {lockedAchievements.slice(0, 4).map(achievement => (
                                <EnhancedAchievementCard
                                    key={achievement.apiname}
                                    achievement={achievement}
                                    unlocked={false}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {achievementsArray.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                        This game has no achievements
                    </div>
                )}
            </div>
        </div>
    );
}
