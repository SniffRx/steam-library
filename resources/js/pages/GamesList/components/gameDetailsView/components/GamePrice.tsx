import React from 'react';
import { DollarSign, Tag } from 'lucide-react';

export const GamePrice = ({ details }) => {
    if (details.game_info.price === undefined || details.game_info.price === null) return null;

    const price = details.game_info.price;
    const isFree = price === 'Free to Play' || price === 'Бесплатно' || price === '0' || price === 0;

    return (
        <div className={`flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-xl border ${
            isFree
                ? 'bg-blue-500/20 border-blue-500/30'
                : 'bg-green-500/20 border-green-500/30'
        }`}>
            {isFree ? (
                <Tag className="w-4 h-4 text-blue-400" />
            ) : (
                <DollarSign className="w-4 h-4 text-green-400" />
            )}
            <span className={`text-sm font-semibold ${
                isFree ? 'text-blue-400' : 'text-green-400'
            }`}>
                {price}
            </span>
        </div>
    );
};

export default GamePrice;
