import { motion } from 'framer-motion';
import { itemVariants } from '@/pages/Welcome/types';

export const RightColumn = () => {
    return (
        <motion.div variants={itemVariants} className="flex-1 relative">
            <div className="relative bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 shadow-2xl">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-red-400 shadow-lg shadow-red-400/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50"></div>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">SteamLibrary Dashboard</span>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-4 border border-white/5">
                        <div className="flex items-center space-x-3 mb-4">
                            <img
                                style={{ objectFit: 'cover' }}
                                src="https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_600x900.jpg"
                                alt="Game"
                                className="w-16 h-16 rounded-lg shadow-lg"
                            />
                            <div>
                                <h3 className="font-semibold text-slate-100">The Witcher 3: Wild Hunt</h3>
                                <div className="flex items-center space-x-2 text-xs text-slate-400">
                                    <span>Completed: 100%</span>
                                    <span>•</span>
                                    <span>Achievements: 78/78</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs mb-1.5 text-slate-300">
                                    <span>Progress</span>
                                    <span className="font-medium">100%</span>
                                </div>
                                <div className="h-2 bg-slate-800/50 backdrop-blur-sm rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-500/50" style={{ width: '100%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-1.5 text-slate-300">
                                    <span>Achievements</span>
                                    <span className="font-medium">78/78</span>
                                </div>
                                <div className="h-2 bg-slate-800/50 backdrop-blur-sm rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg shadow-green-500/50" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { name: 'Cyberpunk 2077', progress: 65, achievements: '32/48' },
                            { name: 'Elden Ring', progress: 85, achievements: '42/52' },
                            { name: 'Stardew Valley', progress: 100, achievements: '40/40' },
                            { name: 'Hades', progress: 90, achievements: '45/49' }
                        ].map((game, i) => (
                            <div
                                key={i}
                                className="bg-slate-900/40 backdrop-blur-lg rounded-lg p-3 border border-white/5 hover:border-cyan-400/30 hover:bg-white/5 transition-all duration-300 cursor-pointer group"
                            >
                                <h4 className="text-xs font-medium truncate text-slate-200 group-hover:text-cyan-400 transition-colors">{game.name}</h4>
                                <div className="mt-2">
                                    <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                game.progress === 100
                                                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/50'
                                                    : 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50'
                                            }`}
                                            style={{ width: `${game.progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1.5">{game.achievements}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
