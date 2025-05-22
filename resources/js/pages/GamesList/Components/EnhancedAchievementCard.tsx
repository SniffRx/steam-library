import { useState } from 'react';

export default function EnhancedAchievementCard({
                                                    achievement,
                                                    unlocked
                                                }: {
    achievement: {
        name: string;
        achieved: boolean;
        unlocktime?: number;
        description?: string;
        icon?: string;
    };
    unlocked: boolean;
}) {
    const [expanded, setExpanded] = useState(false);
    const hasDetails = achievement.description || (unlocked && achievement.unlocktime);

    const defaultIcon = '/images/placeholder-achievement.png';

    return (
        <div
            className={`p-4 rounded-lg transition-all ${
                unlocked
                    ? 'bg-green-900/10 hover:bg-green-900/20'
                    : 'bg-gray-700/30 hover:bg-gray-700/50'
            } ${hasDetails ? 'cursor-pointer' : ''}`}
            onClick={() => hasDetails && setExpanded(!expanded)}
        >
            <div className="flex items-start gap-4">
                {/* Иконка достижения */}
                <div className={`relative flex-shrink-0 ${
                    unlocked ? 'text-green-400' : 'text-gray-500'
                }`}>
                    <div className={`p-1 rounded-lg ${
                        unlocked ? 'bg-green-500/10' : 'bg-gray-600/30'
                    }`}>
                        <img
                            src={achievement.icon || defaultIcon}
                            alt={achievement.name}
                            className="w-14 h-14 object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/placeholder-achievement.png';
                            }}
                        />
                    </div>
                    {unlocked && (
                        <div
                            className="absolute -top-2 -right-2 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center"
                        >
                            <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Основное содержимое */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h4 className={`font-medium ${
                                unlocked ? 'text-green-300' : 'text-gray-300'
                            }`}>
                                {achievement.name}
                            </h4>
                            {achievement.description && expanded && (
                                <p className="text-sm text-gray-400 mt-1 animate-fadeIn">
                                    {achievement.description}
                                </p>
                            )}
                        </div>
                        {hasDetails && (
                            <button
                                className="text-gray-400 hover:text-white transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpanded(!expanded);
                                }}
                            >
                                <svg
                                    className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path fillRule="evenodd"
                                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                          clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Детали при раскрытии */}
                    {expanded && (
                        <div className="mt-2 space-y-1 animate-fadeIn">
                            {unlocked && achievement.unlocktime && (
                                <div className="flex items-center text-xs text-gray-500">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                              clipRule="evenodd" />
                                    </svg>
                                    Unlocked on {new Date(achievement.unlocktime * 1000).toLocaleDateString()}
                                </div>
                            )}
                            <div className="flex items-center text-xs text-gray-500">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd"
                                          d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
                                          clipRule="evenodd" />
                                </svg>
                                {unlocked ? 'Achievement unlocked' : 'Not achieved yet'}
                            </div>
                        </div>
                    )}
                </div>

                {/* Статус */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    unlocked ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/50 text-gray-500'
                }`}>
                    {unlocked ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                  clipRule="evenodd" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Прогресс бар для незавершённых */}
            {!unlocked && (
                <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: '0%' }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right">0% completed</p>
                </div>
            )}
        </div>
    );
}
