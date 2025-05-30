import React from 'react';

interface MiniGameCardProps {
    game: {
        appid: number;
        name: string;
        playtime_forever: number;
        img_icon_url: string;
    };
    isCompleted: boolean;
    onGameSelect: () => void;
}

const MiniGameCard = React.memo(({ game, isCompleted, onGameSelect }: MiniGameCardProps) => {
    return (
        <div
            onClick={onGameSelect}
            className="bg-gray-700/50 hover:bg-gray-700 transition cursor-pointer flex items-center space-x-3 p-3 rounded"
        >
            <img
                src={`https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                alt={game.name}
                className="w-10 h-10 object-cover rounded"
            />
            <div>
                <h3 className="text-white text-sm">{game.name}</h3>
                <p className="text-xs text-gray-400">
                    {Math.floor(game.playtime_forever / 60)} ч
                </p>
            </div>
        </div>
    );
});

export default MiniGameCard;
