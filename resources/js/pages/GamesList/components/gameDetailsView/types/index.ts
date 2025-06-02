export interface GameInfo {
    name?: string;
    detailed_description?: string;
    header_image?: string;
    pc_requirements?: { minimum?: string };
    genres?: Array<{ description: string }>;
    categories?: Array<{ description: string }>;
    screenshots?: Array<{
        path_thumbnail: string;
        path_full: string;
    }>;
    movies?: Array<{
        id: number;
        name: string;
        thumbnail: string;
        webm?: { max: string };
    }>;
    ratings?: Record<string, any>;
    platforms?: {
        windows?: boolean;
        mac?: boolean;
        linux?: boolean;
    };
    steam_deck_compatibility?: string;
}

export interface Achievement {
    apiname: string;
    name: string;
    description: string;
    icon: string;
    icon_gray: string;
    achieved: number; // 1 или 0
    unlocktime: number; // timestamp
}

export interface Friend {
    steamid: string;
    personaname: string;
    avatar: string;
    gameextrainfo?: string;
}

export interface Game {
    appid: number;
    name: string;
    playtime_forever: number;
}

export interface GameDetailsProps {
    game: Game;
    details: {
        achievements: Achievement[];
        friendsPlaying: Friend[];
        game_info: GameInfo;
    } | null;
    loading: boolean;
    onClose: () => void;
}
