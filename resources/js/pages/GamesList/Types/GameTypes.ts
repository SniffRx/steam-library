export type Game = {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
    playtime_2weeks?: number;
    playtime_deck_forever?: number;
    playtime_windows_forever?: number;
    playtime_linux_forever?: number;
    playtime_mac_forever?: number;
    rtime_last_played?: number;
    achievements?: Achievement[];
};

export type Achievement = {
    index: number;
    apiname: string;
    achieved: 0 | 1;
    unlocktime?: number;
    description?: string;
    icon?: string;
};

export type GameDetails = {
    name: string;
    header_image?: string;
    short_description?: string;
    price?: string;
    metacritic?: { score: number };
    achievements: Achievement[];
    friends?: Friend[];
    screenshots?: { id: number; path_thumbnail: string; path_full: string }[];
    movies?: { id: number; name: string; thumbnail: string; webm?: { max: string }; mp4?: { max: string } }[];
    about_the_game?: string;
    developers?: string[];
    publishers?: string[];
    release_date?: { date: string; coming_soon: boolean; };
    website?: string;
    price_overview?: { final_formatted: string; };
    categories: { id: number; description: string }[];
    platforms: { windows: boolean; mac: boolean; linux: boolean };
    deck_compatibility?: { compatible: boolean; note: string };
    background: string;
    is_free: boolean;
    supported_languages: string[];
    pc_requirements?: { minimum: string };
    content_descriptors?: { ids: number[]; notes?: string };
    support_info?: { url: string; email: string };
};

export type Friend = {
    steamid: string;
    personaname: string;
    avatar: string;
    gameextrainfo?: string;
    gameid?: string;
    achievements?: Achievement[];
};

export type PageProps = {
    games: Game[];
    friends: Friend[];
    gameCount: number;
    error?: string;
};

export type Screenshot = {
    id: number;
    path_thumbnail: string;
    path_full: string;
};

export type Movie = {
    id: number;
    name: string;
    thumbnail: string;
    webm?: { max: string };
    mp4?: { max: string };
};
