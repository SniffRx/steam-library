import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';

export const UserFriends = ({userFriends, userInfo}) => {
    return (
        <div className="rounded-xl border border-[#66C0F4]/20 bg-[#1B2838]/50 p-6">
            <h2 className="mb-4 text-xl font-bold text-[#66C0F4]">Друзья онлайн ({userFriends.online_friends_count})</h2>
            <div className="space-y-3">
                {userFriends?.online_friends?.map((friend, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg border border-[#66C0F4]/10 bg-[#0E1621]/70 p-3 transition-all hover:bg-[#0E1621]"
                    >
                        <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-[#2c5364]">
                                <img className="rounded-full" src={friend.avatarfull} />
                            </div>
                            <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-[#1B2838] bg-green-500"></span>
                        </div>
                        <div className="min-w-0 flex-1" onClick={() => router.visit(`/steam/user/${friend.steamid}`)}>
                            <h3 className="truncate font-medium">{friend.personaname}</h3>
                            <div className="truncate text-sm text-[#C7D5E0]">
                                {friend.gameextrainfo ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 flex items-center gap-2">
                                        <motion.a
                                            whileHover={{ scale: 1.1 }}
                                            href={`https://store.steampowered.com/app/${friend.gameid}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <img
                                                src={`https://steamcdn-a.akamaihd.net/steam/apps/${friend.gameid}/capsule_184x69.jpg`}
                                                alt={friend.gameextrainfo}
                                                className="h-8 w-8 rounded-sm border border-[#66C0F4]/30 object-cover transition-all group-hover:border-[#66C0F4]"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '';
                                                }}
                                            />
                                            <span className="absolute z-10 mt-1 hidden rounded-lg border border-[#66C0F4]/20 bg-[#1B2838] p-2 text-xs whitespace-nowrap text-[#66C0F4] group-hover:block">
                                                {friend.gameextrainfo}
                                            </span>
                                        </motion.a>
                                        <p className="truncate text-sm text-[#C7D5E0]">
                                            Playing <span className="font-medium text-[#66C0F4]">{friend.gameextrainfo}</span>
                                        </p>
                                    </motion.div>
                                ) : (
                                    <p className="mt-1 text-sm text-[#C7D5E0]">
                                        {friend.personastate === 1 ? 'Online' : friend.personastate === 2 ? 'Busy' : 'Away'}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            className="rounded bg-[#66C0F4]/10 px-2 py-1 text-xs text-[#66C0F4] hover:bg-[#66C0F4]/20"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(friend.profileurl, '_blank');
                            }}
                        >
                            Steam профиль
                        </button>
                        <button
                            className="rounded bg-[#66C0F4]/10 px-2 py-1 text-xs text-[#66C0F4] hover:bg-[#66C0F4]/20"
                            onClick={() => window.location.href = `steam://friends/message/${friend.steamid}`}
                        >
                            Написать в Steam
                        </button>
                    </div>
                ))}
            </div>
            <button
                className="mt-4 w-full rounded-lg border border-[#66C0F4]/30 bg-[#66C0F4]/10 py-2 text-sm text-[#66C0F4] transition-all hover:bg-[#66C0F4]/20"
                onClick={(e) => {
                    e.stopPropagation();
                    window.open(userInfo.profileurl + 'friends', '_blank');
                }}
            >
                Показать всех друзей
            </button>
        </div>
    );
}
