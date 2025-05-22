export default function GameCard({
                                     game,
                                     isSelected,
                                     isCompleted,
                                     onSelect,
                                     onCompletion
                                 }: {
    game: {
        appid: number;
        name: string;
        playtime_forever: number;
        img_icon_url?: string;
        playtime_2weeks?: number;
        achievements?: {
            name: string;
            achieved: boolean;
            unlocktime?: number;
            description?: string;
            icon?: string;
        }[];
    };
    isSelected: boolean;
    isCompleted: boolean;
    onSelect: () => void;
    onCompletion: () => void;
}) {
    return (
        <div
            className={`p-4 rounded-lg cursor-pointer transition-all ${
                isSelected
                    ? 'bg-blue-600/20 border-2 border-blue-500'
                    : 'bg-gray-700/50 hover:bg-gray-700/70 border-2 border-transparent'
            }`}
            onClick={onSelect}
        >
            <div className="flex items-center gap-4">
                {game.img_icon_url && (
                    <img
                        src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                        alt={game.name}
                        className="w-16 h-16 rounded-lg object-cover"
                    />
                )}
                <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                        {game.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                        {(game.playtime_forever / 60).toFixed(1)} hours
                    </p>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onCompletion();
                    }}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        isCompleted
                            ? 'bg-green-600/90 hover:bg-green-700 text-white'
                            : 'bg-gray-600/70 hover:bg-gray-500/80 text-gray-300'
                    }`}
                >
                    {isCompleted ? '✓ Completed' : 'Mark Complete'}
                </button>
            </div>
        </div>
    );
}
