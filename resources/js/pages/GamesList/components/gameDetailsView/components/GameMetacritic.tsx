import React from 'react';
import { TrendingUp } from 'lucide-react';

export const GameMetacritic = ({ details }) => {
    if (!details.game_info.metacritic_score) return null;

    const score = details.game_info.metacritic_score;

    // Определяем цвет в зависимости от оценки
    const getScoreColor = (score: number) => {
        if (score >= 75) return {
            bg: 'bg-green-500/20',
            border: 'border-green-500/30',
            text: 'text-green-400'
        };
        if (score >= 50) return {
            bg: 'bg-yellow-500/20',
            border: 'border-yellow-500/30',
            text: 'text-yellow-400'
        };
        return {
            bg: 'bg-red-500/20',
            border: 'border-red-500/30',
            text: 'text-red-400'
        };
    };

    const colors = getScoreColor(score);

    return (
        <div className={`flex items-center gap-2 ${colors.bg} border ${colors.border} backdrop-blur-md px-4 py-2 rounded-xl`}>
            <TrendingUp className={`w-4 h-4 ${colors.text}`} />
            <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${colors.text}`}>{score}</span>
                <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <span className="text-xs text-slate-400">Metacritic</span>
        </div>
    );
};

export default GameMetacritic;
