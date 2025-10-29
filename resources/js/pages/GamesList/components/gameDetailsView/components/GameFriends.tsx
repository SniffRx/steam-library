import { motion } from 'framer-motion';
import React from 'react';
import { Users, Gamepad2, ExternalLink } from 'lucide-react';

export const GameFriends = ({ details }) => {
    return (
        <section>
            <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">
                    Друзья играют
                </h3>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-sm font-semibold text-purple-400">
                    {details.friendsPlaying.length}
                </span>
            </div>

            {details.friendsPlaying.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {details.friendsPlaying.map((friend, index) => (
                        <motion.div
                            key={friend.steamid}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-4 rounded-xl bg-slate-900/40 border border-white/5 p-4 hover:border-purple-500/30 transition-all cursor-pointer group"
                            onClick={() => window.open(`https://steamcommunity.com/profiles/${friend.steamid}`, '_blank')}
                        >
                            {/* Avatar */}
                            <div className="relative">
                                <img
                                    src={friend.avatar}
                                    alt={friend.personaname}
                                    className="w-14 h-14 rounded-full border-2 border-white/10 shadow-lg"
                                />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                                    {friend.personaname}
                                </h4>
                                {friend.gameextrainfo ? (
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Gamepad2 className="w-4 h-4" />
                                        <span className="truncate">{friend.gameextrainfo}</span>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400">Играет в эту игру</p>
                                )}
                            </div>

                            {/* External Link Icon */}
                            <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition-colors" />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-white/5">
                    <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 mb-2">Никто из ваших друзей не играет в эту игру</p>
                    <p className="text-sm text-slate-500">Пригласите друзей присоединиться!</p>
                </div>
            )}
        </section>
    );
};

export default GameFriends;
