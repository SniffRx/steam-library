import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { iso2name } from '@/lib/country';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard'
    }
];

type UserInfo = {
    steamid: number;
    communityvisibilitystate: number;
    profilestate: number;
    personaname: string;
    commentpermission: number;
    profileurl: string;
    avatar: string;
    avatarmedium: string;
    avatarfull: string;
    avatarhash: string;
    lastlogoff: number;
    personastate: number;
    realname: string;
    primaryclanid: number;
    timecreated: number;
    personastateflags: number;
    loccountrycode: string;
    locstatecode: string;
}

type UserFriends = {
    total_friends: number;
    online_friends: {
        steamid: string;
        relationship: string;
        friend_since: number; // timestamp
        // Дополнительные данные, которые можно получить из GetPlayerSummaries
        personaname?: string;
        avatar?: string;
        avatarmedium?: string;
        avatarfull?: string;
        personastate?: number; // статус (0 - оффлайн, 1 - онлайн и т.д.)
        gameextrainfo?: string; // во что играет, если онлайн
        gameid?: string;
    };
}

type UserLevel = number;

export default function Dashboard() {
    const { steamUserInfo, steamUserFriends, steamUserLevel } = usePage<SharedData & {
        steamUserInfo: UserInfo;
        steamUserFriends: UserFriends;
        steamUserLevel: UserLevel;
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Steam Profile" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Основная карточка профиля */}
                <div
                    className="bg-gradient-to-br from-blue-200/80 to-purple-300/80 dark:from-blue-900/80 dark:to-purple-900/80 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                        {/* Аватар и основная информация */}
                        <div className="flex-shrink-0">
                            <div className="relative group">
                                <img
                                    src={steamUserInfo.avatarfull}
                                    alt="Avatar"
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 shadow-lg transition-all duration-300 group-hover:scale-105"
                                />
                                <div
                                    className="absolute inset-0 bg-blue-500/10 rounded-full scale-0 group-hover:scale-100 transition-all duration-300" />
                            </div>
                        </div>

                        {/* Информация о профиле */}
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white/80">
                                    {steamUserInfo.personaname}
                                </h1>
                                {
                                    steamUserInfo.personastate !== undefined && (
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-2 ${
                                                steamUserInfo.personastate === 0 ? 'bg-gray-500/80 text-gray-100' :
                                                    steamUserInfo.personastate === 1 ? 'bg-green-500/90 text-white' :
                                                        steamUserInfo.personastate === 2 ? 'bg-red-500/90 text-white' :
                                                            steamUserInfo.personastate === 3 ? 'bg-yellow-500/90 text-gray-900' :
                                                                steamUserInfo.personastate === 4 ? 'bg-purple-500/90 text-white' :
                                                                    steamUserInfo.personastate === 5 ? 'bg-amber-600/90 text-white' :
                                                                        'bg-blue-500/90 text-white' // Для статуса 6 и других
                                            }`}>
      {steamUserInfo.personastate === 0 ? (
          <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd" />
              </svg>
              Offline
          </>
      ) : steamUserInfo.personastate === 1 ? (
          <>
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Online
          </>
      ) : steamUserInfo.personastate === 2 ? (
          <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z"
                        clipRule="evenodd" />
              </svg>
              Busy
          </>
      ) : steamUserInfo.personastate === 3 ? (
          <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                      d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              Away
          </>
      ) : steamUserInfo.personastate === 4 ? (
          <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd" />
              </svg>
              Snooze
          </>
      ) : steamUserInfo.personastate === 5 ? (
          <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                      d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clipRule="evenodd" />
              </svg>
              Looking to trade
          </>
      ) : (
          <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd" />
              </svg>
              Looking to play
          </>
      )}
    </span>
                                    )
                                }
                            </div>

                            {steamUserInfo.realname && (
                                <p className="text-gray-900 dark:text-white/80">
                                    {steamUserInfo.realname}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-3 pt-2">
                                <a
                                    href={steamUserInfo.profileurl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 backdrop-blur-sm rounded-lg text-gray-900 dark:text-white transition-all flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M11.229 11.229C13.733 8.724 16.267 4.153 17.748 2.672c1.913-1.913 4.229-2.735 5.535-1.429 1.306 1.306.484 3.622-1.429 5.535-1.481 1.481-6.052 4.015-8.557 6.52-.396.396-.792.792-1.147 1.188l5.181 5.181c.396-.355.792-.751 1.188-1.147zm-9.6 3.2c-.396.396-.792.792-1.188 1.188L2 20.057c1.306 1.306 3.622.484 5.535-1.429 1.481-1.481 4.015-6.052 6.52-8.557.396-.396.792-.792 1.147-1.188L9.52 4.702c-.355.396-.751.792-1.147 1.188-2.505 2.505-6.076 5.039-8.557 6.52-1.913 1.913-2.735 4.229-1.429 5.535z" />
                                    </svg>
                                    Steam Profile
                                </a>

                                <div
                                    className="px-4 py-2 bg-gray-200 dark:bg-white/10 rounded-lg text-gray-900 dark:text-white flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-blue-400" />
                                    Level: {steamUserLevel}
                                </div>

                                {steamUserInfo.loccountrycode && (
                                    <div
                                        className="px-4 py-2 bg-gray-200 dark:bg-white/10 rounded-lg text-gray-900 dark:text-white flex items-center gap-2">
                                        <span className="text-lg">🌍</span>
                                        {iso2name[steamUserInfo.loccountrycode] || 'Unknown country'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Дополнительная информация */}
                    <div className="bg-white/5 backdrop-blur-sm p-6 border-t border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/25 dark:bg-white/5 p-4 rounded-lg">
                                <h3 className="text-sm font-semibold text-gray-600 dark:text-white/70 mb-2">Member
                                    Since</h3>
                                <p className="dark:text-white">
                                    {new Date(steamUserInfo.timecreated * 1000).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="bg-white/25 dark:bg-white/5 p-4 rounded-lg">
                                <h3 className="text-sm font-semibold text-gray-600 dark:text-white/70 mb-2">Last
                                    Online</h3>
                                <p className="dark:text-white">
                                    {new Date(steamUserInfo.lastlogoff * 1000).toLocaleString()}
                                </p>
                            </div>

                            <div className="bg-white/25 dark:bg-white/5 p-4 rounded-lg">
                                <h3 className="text-sm font-semibold text-gray-600 dark:text-white/70 mb-2">Friends</h3>
                                <p className="dark:text-white">
                                    {steamUserFriends.total_friends}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Статистика и игры */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Блок с играми */}
                    <div className="md:col-span-2 bg-gray-900/50 rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-4">🎮 Recent Activity</h2>
                        <div className="space-y-4">
                            {/* Здесь можно добавить список игр */}
                            <div className="bg-white/5 hover:bg-white/10 p-4 rounded-lg transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0" />
                                    <div>
                                        <h3 className="font-medium text-white">Game Name</h3>
                                        <p className="text-sm text-white/60">2.5 hours last 2 weeks</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Блок с друзьями */}
                    <div className="bg-gray-900/50 rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-4">👥 Friends
                            ({steamUserFriends.total_friends})</h2>

                        {/* Разделение на две колонки */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {steamUserFriends.online_friends.slice(0, 14).map(friend => (
                                <div
                                    key={friend.steamid}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer"
                                    onClick={() => window.open(`/${friend.steamid}`, '_blank')}
                                >
                                    <div className="relative">
                                        <img
                                            src={friend.avatar}
                                            alt={friend.personaname}
                                            className="w-12 h-12 rounded-full border-2 border-blue-500/50"
                                        />
                                        {/* Индикатор статуса */}
                                        <span
                                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
                                                friend.personastate === 1 ? 'bg-green-500' :
                                                    friend.personastate === 2 ? 'bg-red-500' :
                                                        'bg-yellow-500'
                                            }`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-white truncate">{friend.personaname}</p>
                                            {/* Кнопка перехода в Steam */}
                                            <button
                                                className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-0.5 rounded transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(friend.profileurl, '_blank');
                                                }}
                                            >
                                                Steam
                                            </button>
                                        </div>

                                        {friend.gameextrainfo ? (
                                            <div className="flex items-center gap-2 mt-1">
                                                <a
                                                    href={`https://store.steampowered.com/app/${friend.gameid}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group relative"
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    <img
                                                        src={`https://steamcdn-a.akamaihd.net/steam/apps/${friend.gameid}/capsule_184x69.jpg`}
                                                        alt={friend.gameextrainfo}
                                                        className="w-8 h-8 rounded-sm object-cover border border-gray-600/50 group-hover:border-blue-400 transition-all"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/184x69/1a202c/718096?text=Game';
                                                        }}
                                                    />
                                                    {/* Подсказка при наведении */}
                                                    <span
                                                        className="absolute z-10 hidden group-hover:block bg-gray-900 text-white text-xs p-1 rounded mt-1 whitespace-nowrap">
                                                      {friend.gameextrainfo}
                                                    </span>
                                                </a>
                                                <p className="text-sm text-gray-300 truncate">
                                                    Playing <span
                                                    className="text-blue-300">{friend.gameextrainfo}</span>
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 mt-1">
                                                {friend.personastate === 1 ? 'Online' :
                                                    friend.personastate === 2 ? 'Busy' : 'Away'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
