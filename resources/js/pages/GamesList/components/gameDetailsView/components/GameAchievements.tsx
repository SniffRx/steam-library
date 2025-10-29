import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Award, Lock, Unlock } from 'lucide-react';

export const GameAchievements = ({ details, completedAchievements, totalAchievements }) => {
    const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

    const filteredAchievements = details.achievements.filter(achievement => {
        if (filter === 'unlocked') return achievement.achieved === 1;
        if (filter === 'locked') return achievement.achieved === 0;
        return true;
    });

    const percentage = totalAchievements > 0 ? Math.round((completedAchievements / totalAchievements) * 100) : 0;

    return (
        <section>
            {/* Header with Progress */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Award className="w-6 h-6 text-blue-400" />
                        Достижения
                    </h3>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-white">{completedAchievements}/{totalAchievements}</div>
                        <div className="text-sm text-slate-400">{percentage}% завершено</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-3 bg-slate-900/50 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 mt-4">
                    {[
                        { key: 'all', label: 'Все', icon: Award },
                        { key: 'unlocked', label: 'Получено', icon: Unlock },
                        { key: 'locked', label: 'Заблокировано', icon: Lock }
                    ].map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key as typeof filter)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                filter === key
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    : 'bg-slate-900/40 text-slate-400 border border-white/5 hover:bg-slate-900/60'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Achievements Grid */}
            {totalAchievements > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredAchievements.map((achievement, index) => {
                        const isUnlocked = achievement.achieved === 1;
                        const unlockDate = achievement.unlocktime
                            ? format(new Date(achievement.unlocktime * 1000), 'd MMMM yyyy', { locale: ru })
                            : null;

                        return (
                            <motion.div
                                key={achievement.apiname}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`flex items-start gap-4 rounded-xl p-4 border transition-all ${
                                    isUnlocked
                                        ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/5 border-green-500/30'
                                        : 'bg-slate-900/40 border-white/5 opacity-60'
                                }`}
                            >
                                {/* Icon */}
                                <img
                                    src={isUnlocked ? achievement.icon : achievement.icon_gray}
                                    alt={achievement.name || 'Achievement'}
                                    className="w-16 h-16 rounded-lg border-2 border-white/10 shadow-lg flex-shrink-0"
                                    onError={(e) => {
                                        e.currentTarget.src = '/images/achievement-locked.png';
                                    }}
                                />

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-white mb-1">{achievement.name}</h4>
                                    <p className="text-sm text-slate-400 mb-2 line-clamp-2">
                                        {achievement.description || 'Нет описания'}
                                    </p>

                                    {isUnlocked ? (
                                        <div className="flex items-center gap-2 text-xs text-green-400">
                                            <Unlock className="w-3 h-3" />
                                            {unlockDate && <span>Получено {unlockDate}</span>}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Lock className="w-3 h-3" />
                                            <span>Заблокировано</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-white/5">
                    <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">У этой игры нет достижений</p>
                </div>
            )}
        </section>
    );
};

export default GameAchievements;
