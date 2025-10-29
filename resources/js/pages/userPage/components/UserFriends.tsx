import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, ExternalLink, Gamepad2 } from 'lucide-react';

export const UserFriends = ({ userFriends, userInfo }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1a1f29]/60 backdrop-blur-xl rounded-2xl p-6 border border-white/5"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-500/10 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-green-400" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Друзья онлайн</h3>
                    <p className="text-sm text-slate-400">{userFriends.online_friends_count} в сети</p>
                </div>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {userFriends.online_friends.map((friend, i) => (
                    <motion.div
                        key={friend.steamid}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                        onClick={() => router.visit(`/steam/user/${friend.steamid}`)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-white/5 hover:border-green-400/30 transition-all cursor-pointer group"
                    >
                        <div className="relative">
                            <img
                                src={friend.avatarfull}
                                alt={friend.personaname}
                                className="w-12 h-12 rounded-full border-2 border-white/10"
                            />
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1f29]"></span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white truncate group-hover:text-green-400 transition-colors">
                                {friend.personaname}
                            </h4>
                            {friend.gameextrainfo ? (
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                    <Gamepad2 className="w-3 h-3" />
                                    <span className="truncate">{friend.gameextrainfo}</span>
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400">В сети</p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); window.location.href = `steam://friends/message/${friend.steamid}`; }}
                                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition-colors"
                                title="Написать"
                            >
                                <MessageCircle className="w-4 h-4 text-slate-400" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); window.open(friend.profileurl, '_blank'); }}
                                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition-colors"
                                title="Профиль"
                            >
                                <ExternalLink className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button
                onClick={() => window.open(userInfo.profileurl + 'friends', '_blank')}
                className="w-full mt-4 py-3 rounded-xl bg-slate-900/40 border border-white/5 hover:border-green-400/30 text-sm font-medium text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2"
            >
                <Users className="w-4 h-4" />
                Показать всех друзей
            </button>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(15, 23, 42, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(59, 130, 246, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(59, 130, 246, 0.5);
                }
            `}</style>
        </motion.div>
    );
};

export default UserFriends;
