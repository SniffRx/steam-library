import { motion } from 'framer-motion';
import React from 'react';

export const GameFriends = ({details}) => {
    return (
        <section>
            <h3 className="mb-4 text-xl font-semibold text-white">Друзья играют ({details.friendsPlaying.length})</h3>
            {details.friendsPlaying.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {details.friendsPlaying.map((friend) => (
                        <motion.div
                            key={friend.steamid}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center space-x-4 rounded bg-gray-800/50 p-4 backdrop-blur-sm"
                        >
                            <img src={friend.avatar} alt={friend.personaname} className="h-10 w-10 rounded-full" />
                            <div>
                                <h4 className="text-sm font-medium text-white">{friend.personaname}</h4>
                                <p className="text-xs text-gray-400">{friend.gameextrainfo}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">Нет друзей, которые играют в эту игру</p>
            )}
        </section>
    )
}
