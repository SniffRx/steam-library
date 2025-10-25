import { useQuery } from '@tanstack/react-query';

interface Achievement {
    apiname: string;
    achieved: boolean;
    unlocktime: number;
    name?: string;
    description?: string;
    icon?: string;
}

interface Friend {
    steamid: string;
    personaname: string;
    avatar: string;
    gameextrainfo?: string;
}

interface GameDetails {
    achievements: Achievement[];
    game_info: any;
    friendsPlaying: Friend[];
}

export function useGameDetails(appid: number | null) {
    return useQuery<GameDetails>({
        queryKey: ['game-details', appid],
        queryFn: async () => {
            if (!appid) throw new Error('No appid provided');

            const [achievementsRes, friendsRes] = await Promise.all([
                fetch(`/steam/game/${appid}/details`, {
                    credentials: 'include',
                }),
                fetch(`/steam/game/${appid}/friends`, {
                    credentials: 'include',
                }),
            ]);

            if (!achievementsRes.ok || !friendsRes.ok) {
                throw new Error('Failed to load game details');
            }

            const data = await achievementsRes.json();
            const friendsData = await friendsRes.json();

            return {
                achievements: data.achievements || [],
                game_info: data.game_info || {},
                friendsPlaying: friendsData.friendsPlaying || [],
            };
        },
        enabled: !!appid,
        staleTime: 10 * 60 * 1000, // Кэшируем на 10 минут
        gcTime: 30 * 60 * 1000, // Храним в кэше 30 минут
    });
}
