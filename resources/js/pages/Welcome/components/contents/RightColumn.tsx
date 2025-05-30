import { motion } from 'framer-motion';
import { itemVariants } from '@/pages/Welcome/types';

export const RightColumn = () => {
    return (
        <motion.div
            variants={itemVariants}
            className="flex-1 relative"
        >
            <div className="relative bg-[#1B2838]/50 rounded-xl p-6 backdrop-blur-sm border border-[#66C0F4]/20">
                <div className="absolute inset-0 bg-[#66C0F4]/10 rounded-xl -z-10"></div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full bg-[#FF5C5C]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#FFBE2E]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#2ACA44]"></div>
                        </div>
                        <span className="text-xs text-[#C7D5E0]">SteamLibrary Dashboard</span>
                    </div>

                    <div className="bg-[#0E1621] rounded-lg p-4 border border-[#66C0F4]/10">
                        <div className="flex items-center space-x-3 mb-4">
                            <img
                                style={{objectFit: "cover"}}
                                src="https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_600x900.jpg"
                                alt="Game"
                                className="w-16 h-16 rounded"
                            />
                            <div>
                                <h3 className="font-medium">The Witcher 3: Wild Hunt</h3>
                                <div className="flex items-center space-x-2 text-xs text-[#C7D5E0]">
                                    <span>Completed: 100%</span>
                                    <span>•</span>
                                    <span>Achievements: 78/78</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Progress</span>
                                    <span>100%</span>
                                </div>
                                <div className="h-2 bg-[#1B2838] rounded-full overflow-hidden">
                                    <div className="h-full bg-[#66C0F4] rounded-full" style={{ width: '100%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Achievements</span>
                                    <span>78/78</span>
                                </div>
                                <div className="h-2 bg-[#1B2838] rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
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
                            <div key={i}
                                 className="bg-[#0E1621]/80 rounded p-2 border border-[#66C0F4]/5 hover:border-[#66C0F4]/20 transition-colors duration-200">
                                <h4 className="text-xs font-medium truncate">{game.name}</h4>
                                <div className="mt-1">
                                    <div className="h-1 bg-[#1B2838] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${game.progress === 100 ? 'bg-green-500' : 'bg-[#66C0F4]'} rounded-full`}
                                            style={{ width: `${game.progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-[#C7D5E0] mt-0.5">{game.achievements}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
