import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { motion } from 'framer-motion';
import React from 'react';

export const GameAchievements = ({details, completedAchievements, totalAchievements}) => {
    return (
        <section>
            <h3 className="mb-4 text-xl font-semibold text-white">
                Достижения ({completedAchievements}/{totalAchievements})
            </h3>
            {totalAchievements > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
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
                                className={`flex items-center space-x-3 rounded-lg bg-gray-700/50 p-4 ${
                                    isUnlocked
                                        ? 'border-2 border-green-500 bg-gradient-to-r from-green-900/20 to-transparent'
                                        : 'opacity-80'
                                }`}
                            >
                                {/* Иконка */}
                                <img
                                    src={isUnlocked ? achievement.icon : achievement.icon_gray}
                                    alt={achievement.name || 'Achievement Icon'}
                                    className="h-12 w-12 rounded object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = '/images/achievement-locked.png';
                                    }}
                                />

                                {/* Информация */}
                                <div>
                                    <h4 className="text-sm font-medium text-white">{achievement.name}</h4>
                                    <p className="line-clamp-1 text-xs text-gray-400">{achievement.description || 'Нет описания'}</p>

                                    {/* Дата разблокировки */}
                                    {isUnlocked && unlockDate && (
                                        <p className="mt-1 text-xs text-green-400">Разблокировано: {unlockDate}</p>
                                    )}

                                    {/* Статус */}
                                    <p className="mt-1 text-xs text-gray-500">{isUnlocked ? '✅ Получено' : '🔒 Не получено'}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-400">Нет достижений</p>
            )}
        </section>
    )
}
export default GameAchievements;
