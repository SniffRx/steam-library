import { GameCard } from './GameCard';

interface Game {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
}

interface FriendsProps {
    steamid: string;
    personaname: string;
    avatar: string;
}

interface GamesGridProps {
    games: Game[];
    friends: FriendsProps[];
    completedGames: number[];
    onCompletionToggle: (gameId: number) => void;
    onGameSelect: (game: Game) => void;
}

export const GamesGrid = ({
                              games,
                              friends,
                              completedGames,
                              onCompletionToggle,
                              onGameSelect,
                          }: GamesGridProps) => {
    return (
        <div className="bg-gray-800/80 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">
                        My Games <span className="text-gray-400 text-sm">({games.length})</span>
                    </h2>
                    <div className="text-sm text-gray-400">
                        <span className="text-green-500">{completedGames.length} completed</span>
                        {' • '}
                        <span>{games.length - completedGames.length} remaining</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {games.map(game => (
                    <GameCard
                        key={game.appid}
                        game={game}
                        friends={friends}
                        isCompleted={completedGames.includes(game.appid)}
                        onCompletionToggle={onCompletionToggle}
                        onGameSelect={onGameSelect}
                    />
                ))}
            </div>
        </div>
    );
};
