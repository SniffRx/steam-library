import React from 'react';

interface GameCardProps {
    game: any;
    isCompleted: boolean;
    onCompletionToggle: (id: number) => void;
    onGameSelect: (game: any) => void;
}

const GameCard = React.memo(({ game, isCompleted, onCompletionToggle, onGameSelect }: GameCardProps) => {
    return (
        <div
            className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition cursor-pointer"
            onClick={() => onGameSelect(game)}
        >
            <img
                src={`https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                alt={game.name}
                loading="lazy"
                className="w-full h-40 object-cover rounded"
            />
            <h3 className="text-white mt-2">{game.name}</h3>
            <p className="text-sm text-gray-400">
                {Math.floor(game.playtime_forever / 60)} ч
            </p>
            <div className="flex items-center justify-between mt-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onCompletionToggle(game.appid);
                    }}
                    className={`mt-2 px-3 py-1 rounded ${
                        isCompleted ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                >
                    {isCompleted ? '✅ Completed' : '🔘 Mark as done'}
                </button>
                <button className="mt-2 px-3 py-1 rounded bg-blue-400 cursor-pointer"
                        onClick={() => window.location.href = `steam://run/${game.appid}`}>
                    Play
                </button>
            </div>
        </div>
    );
});

export default GameCard;
