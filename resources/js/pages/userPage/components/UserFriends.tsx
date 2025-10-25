import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, ExternalLink, Gamepad2 } from 'lucide-react';
import UserRecentlyGames from '@/pages/userPage/components/UserRecentlyGames';

export const UserFriends = ({ userFriends, userInfo }) => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-white/20 hover:shadow-xl hover:shadow-white/5">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

            <div className="relative mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-gradient-to-br from-emerald-500/20 to-green-600/20 p-2.5 shadow-lg shadow-emerald-500/20">
                        <Users className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-xl font-bold text-transparent">
                            Друзья онлайн
                        </h2>
                        <p className="text-sm text-gray-400">{userFriends.online_friends_count} в сети</p>
                    </div>
                </div>
            </div>

            <div className="relative space-y-3">
                {userFriends.online_friends.map((friend, index) => (
                    <motion.div key={friend.steamid} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + index * 0.05 }} whileHover={{ scale: 1.01, x: 4 }} onClick={() => router.visit(`/steam/user/${friend.steamid}`)} className="group/friend relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-r from-white/5 to-white/[0.02] p-4 backdrop-blur-sm transition-all hover:border-white/10 hover:shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 transition-opacity group-hover/friend:opacity-100" />

                        <div className="relative flex items-center gap-4">
                            <motion.img whileHover={{ scale: 1.05 }} className="h-12 w-12 rounded-full border-2 border-white/20 shadow-lg" src={friend.avatarfull} alt={friend.personaname} />
                            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-gray-900 bg-emerald-500 shadow-lg shadow-emerald-500/50" />

                            <div className="min-w-0 flex-1">
                                <h3 className="truncate font-semibold text-white">{friend.personaname}</h3>

                                {friend.gameextrainfo ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1.5 flex items-center gap-2">
                                        <Gamepad2 className="h-3.5 w-3.5 text-blue-400" />
                                        <p className="truncate text-sm text-gray-400">
                                            <span className="text-blue-400 font-medium">{friend.gameextrainfo}</span>
                                        </p>
                                    </motion.div>
                                ) : (
                                    <p className="mt-1 text-sm text-gray-400">
                                        {friend.personastate === 1 ? 'В сети' : friend.personastate === 2 ? 'Занят' : 'Отошёл'}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="rounded-xl bg-white/5 p-2 text-gray-400 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white" onClick={(e) => { e.stopPropagation(); window.location.href = `steam://friends/message/${friend.steamid}`; }} title="Написать в Steam">
                                    <MessageCircle className="h-4 w-4" />
                                </motion.button>

                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="rounded-xl bg-white/5 p-2 text-gray-400 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white" onClick={(e) => { e.stopPropagation(); window.open(friend.profileurl, '_blank'); }} title="Steam профиль">
                                    <ExternalLink className="h-4 w-4" />
                                </motion.button>
                            </div>
                        </div>

                        {friend.gameextrainfo && friend.gameid && (
                            <motion.a initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} href={`https://store.steampowered.com/app/${friend.gameid}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} whileHover={{ scale: 1.02 }} className="relative mt-3 block overflow-hidden rounded-xl border border-white/10">
                                <img src={`https://steamcdn-a.akamaihd.net/steam/apps/${friend.gameid}/capsule_184x69.jpg`} alt={friend.gameextrainfo} className="h-16 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </motion.a>
                        )}
                    </motion.div>
                ))}
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="relative mt-6 w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-white/[0.02] py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-white/20 hover:shadow-lg" onClick={(e) => { e.stopPropagation(); window.open(userInfo.profileurl + 'friends', '_blank'); }}>
                <div className="relative flex items-center justify-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Показать всех друзей</span>
                </div>
            </motion.button>
        </motion.div>
    );
};
export default UserFriends;
